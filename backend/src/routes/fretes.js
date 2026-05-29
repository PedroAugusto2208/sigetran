const router = require('express').Router();
const { Frete, Viagem, Veiculo, Rota, Carga } = require('../models');
const { autenticar } = require('../middleware/auth');
const FreteService = require('../services/FreteService');

router.use(autenticar);

router.get('/', async (req, res) => {
  try {
    res.json(await Frete.findAll({ include: [{ model: Viagem }], order: [['createdAt', 'DESC']] }));
  } catch (e) { res.status(500).json({ erro: e.message }); }
});

router.get('/:id', async (req, res) => {
  try {
    const f = await Frete.findByPk(req.params.id, { include: [Viagem] });
    if (!f) return res.status(404).json({ erro: 'Frete não encontrado' });
    res.json(f);
  } catch (e) { res.status(500).json({ erro: e.message }); }
});

router.post('/calcular', async (req, res) => {
  try {
    const { VeiculoId, RotaId, CargaId } = req.body;
    const [veiculo, rota, carga] = await Promise.all([
      Veiculo.findByPk(VeiculoId),
      Rota.findByPk(RotaId),
      Carga.findByPk(CargaId),
    ]);
    if (!veiculo || !rota || !carga) return res.status(400).json({ erro: 'Dados inválidos' });

    const resultado = FreteService.calcular({
      distanciaKm:     Number(rota.distanciaKm),
      valorPedagio:    Number(rota.valorPedagio),
      pesoKg:          Number(carga.pesoKg),
      capacidadeCarga: Number(veiculo.capacidadeCarga),
      tipoMercadoria:  carga.tipoMercadoria,
    });
    res.json(resultado);
  } catch (e) { res.status(400).json({ erro: e.message }); }
});

module.exports = router;
