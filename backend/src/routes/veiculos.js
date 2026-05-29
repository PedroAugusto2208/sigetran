const router = require('express').Router();
const { Veiculo } = require('../models');
const { autenticar, exigirPerfil } = require('../middleware/auth');

const GESTORES = ['ADMINISTRADOR', 'GESTOR_TRANSPORTE'];

router.use(autenticar);

router.get('/', async (req, res) => {
  try {
    const veiculos = await Veiculo.findAll({ order: [['createdAt', 'DESC']] });
    res.json(veiculos);
  } catch (e) { res.status(500).json({ erro: e.message }); }
});

router.get('/:id', async (req, res) => {
  try {
    const v = await Veiculo.findByPk(req.params.id);
    if (!v) return res.status(404).json({ erro: 'Veículo não encontrado' });
    res.json(v);
  } catch (e) { res.status(500).json({ erro: e.message }); }
});

router.post('/', exigirPerfil(...GESTORES), async (req, res) => {
  try {
    const v = await Veiculo.create(req.body);
    res.status(201).json(v);
  } catch (e) {
    if (e.name === 'SequelizeUniqueConstraintError')
      return res.status(409).json({ erro: 'Placa já cadastrada' });
    res.status(400).json({ erro: e.message });
  }
});

router.put('/:id', exigirPerfil(...GESTORES), async (req, res) => {
  try {
    const v = await Veiculo.findByPk(req.params.id);
    if (!v) return res.status(404).json({ erro: 'Veículo não encontrado' });
    await v.update(req.body);
    res.json(v);
  } catch (e) { res.status(400).json({ erro: e.message }); }
});

router.delete('/:id', exigirPerfil(...GESTORES), async (req, res) => {
  try {
    const v = await Veiculo.findByPk(req.params.id);
    if (!v) return res.status(404).json({ erro: 'Veículo não encontrado' });
    await v.destroy();
    res.status(204).send();
  } catch (e) { res.status(500).json({ erro: e.message }); }
});

module.exports = router;
