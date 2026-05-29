const router = require('express').Router();
const { Viagem, Veiculo, Motorista, Rota, Carga, Cliente, Frete } = require('../models');
const { autenticar, exigirPerfil } = require('../middleware/auth');
const FreteService = require('../services/FreteService');
const { Op } = require('sequelize');

const GESTORES = ['ADMINISTRADOR', 'GESTOR_TRANSPORTE'];
router.use(autenticar);

router.get('/', async (req, res) => {
  try {
    const where = {};
    if (req.usuario.tipo === 'MOTORISTA') where.MotoristaId = req.usuario.id;

    const viagens = await Viagem.findAll({
      where,
      include: [Veiculo, Motorista, Rota, Carga, Cliente, Frete],
      order: [['createdAt', 'DESC']],
    });
    res.json(viagens);
  } catch (e) { res.status(500).json({ erro: e.message }); }
});

router.get('/:id', async (req, res) => {
  try {
    const v = await Viagem.findByPk(req.params.id, {
      include: [Veiculo, Motorista, Rota, Carga, Cliente, Frete],
    });
    if (!v) return res.status(404).json({ erro: 'Viagem não encontrada' });
    res.json(v);
  } catch (e) { res.status(500).json({ erro: e.message }); }
});

router.post('/', exigirPerfil(...GESTORES), async (req, res) => {
  try {
    const { VeiculoId, MotoristaId, RotaId, CargaId, ClienteId, dataPartida } = req.body;

    // Valida disponibilidade
    const ocupado = await Viagem.findOne({
      where: {
        [Op.or]: [{ VeiculoId }, { MotoristaId }],
        status: { [Op.in]: ['PROGRAMADA', 'EM_ANDAMENTO'] },
      },
    });
    if (ocupado) return res.status(409).json({ erro: 'Veículo ou motorista já alocado em viagem ativa' });

    const [veiculo, rota, carga] = await Promise.all([
      Veiculo.findByPk(VeiculoId),
      Rota.findByPk(RotaId),
      Carga.findByPk(CargaId),
    ]);

    if (!veiculo || !rota || !carga) return res.status(400).json({ erro: 'Veículo, rota ou carga inválidos' });
    if (Number(carga.pesoKg) > Number(veiculo.capacidadeCarga))
      return res.status(400).json({ erro: 'Peso da carga excede a capacidade do veículo' });

    const viagem = await Viagem.create({ VeiculoId, MotoristaId, RotaId, CargaId, ClienteId, dataPartida });

    const calculado = FreteService.calcular({
      distanciaKm:     Number(rota.distanciaKm),
      valorPedagio:    Number(rota.valorPedagio),
      pesoKg:          Number(carga.pesoKg),
      capacidadeCarga: Number(veiculo.capacidadeCarga),
      tipoMercadoria:  carga.tipoMercadoria,
    });
    const frete = await Frete.create({ ...calculado, ViagemId: viagem.id });

    res.status(201).json({ viagem, frete });
  } catch (e) { res.status(400).json({ erro: e.message }); }
});

router.patch('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const STATUS_VALIDOS = ['PROGRAMADA', 'EM_ANDAMENTO', 'CONCLUIDA', 'CANCELADA'];
    if (!STATUS_VALIDOS.includes(status)) return res.status(400).json({ erro: 'Status inválido' });

    const v = await Viagem.findByPk(req.params.id);
    if (!v) return res.status(404).json({ erro: 'Viagem não encontrada' });

    if (req.usuario.tipo === 'MOTORISTA' && v.MotoristaId !== req.usuario.id)
      return res.status(403).json({ erro: 'Motorista não autorizado para esta viagem' });

    const updates = { status };
    if (status === 'EM_ANDAMENTO') updates.dataPartida = new Date();
    if (status === 'CONCLUIDA')    updates.dataChegada = new Date();

    await v.update(updates);
    res.json(v);
  } catch (e) { res.status(500).json({ erro: e.message }); }
});

module.exports = router;
