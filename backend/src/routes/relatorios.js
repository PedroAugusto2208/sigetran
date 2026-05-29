const router = require('express').Router();
const { Viagem, Frete, Veiculo, Motorista, Cliente, Rota, Carga } = require('../models');
const { autenticar, exigirPerfil } = require('../middleware/auth');
const { Op } = require('sequelize');

router.use(autenticar);
router.use(exigirPerfil('ADMINISTRADOR', 'FINANCEIRO', 'GESTOR_TRANSPORTE'));

router.get('/viagens', async (req, res) => {
  try {
    const where = {};
    if (req.query.status) where.status = req.query.status;
    if (req.query.inicio && req.query.fim)
      where.createdAt = { [Op.between]: [new Date(req.query.inicio), new Date(req.query.fim)] };
    if (req.query.motoristaId) where.MotoristaId = req.query.motoristaId;
    if (req.query.veiculoId)   where.VeiculoId   = req.query.veiculoId;

    const viagens = await Viagem.findAll({
      where,
      include: [Veiculo, Motorista, Cliente, Rota, Carga, Frete],
      order: [['createdAt', 'DESC']],
    });
    res.json({ total: viagens.length, viagens });
  } catch (e) { res.status(500).json({ erro: e.message }); }
});

router.get('/fretes', async (req, res) => {
  try {
    const fretes = await Frete.findAll({
      include: [{ model: Viagem, include: [Veiculo, Motorista, Cliente] }],
      order: [['createdAt', 'DESC']],
    });
    const totalGeral = fretes.reduce((s, f) => s + Number(f.valorTotal), 0);
    res.json({ total: fretes.length, totalGeral: totalGeral.toFixed(2), fretes });
  } catch (e) { res.status(500).json({ erro: e.message }); }
});

router.get('/dashboard', async (req, res) => {
  try {
    const [programadas, emAndamento, concluidas, canceladas, totalFretes] = await Promise.all([
      Viagem.count({ where: { status: 'PROGRAMADA' } }),
      Viagem.count({ where: { status: 'EM_ANDAMENTO' } }),
      Viagem.count({ where: { status: 'CONCLUIDA' } }),
      Viagem.count({ where: { status: 'CANCELADA' } }),
      Frete.findAll(),
    ]);
    const receitaTotal = totalFretes.reduce((s, f) => s + Number(f.valorTotal), 0);
    res.json({ programadas, emAndamento, concluidas, canceladas, receitaTotal: receitaTotal.toFixed(2) });
  } catch (e) { res.status(500).json({ erro: e.message }); }
});

module.exports = router;
