const router = require('express').Router();
const { Rota } = require('../models');
const { autenticar, exigirPerfil } = require('../middleware/auth');

const GESTORES = ['ADMINISTRADOR', 'GESTOR_TRANSPORTE'];
router.use(autenticar);

router.get('/', async (req, res) => {
  try { res.json(await Rota.findAll({ order: [['origem', 'ASC']] })); }
  catch (e) { res.status(500).json({ erro: e.message }); }
});

router.get('/:id', async (req, res) => {
  try {
    const r = await Rota.findByPk(req.params.id);
    if (!r) return res.status(404).json({ erro: 'Rota não encontrada' });
    res.json(r);
  } catch (e) { res.status(500).json({ erro: e.message }); }
});

router.post('/', exigirPerfil(...GESTORES), async (req, res) => {
  try { res.status(201).json(await Rota.create(req.body)); }
  catch (e) { res.status(400).json({ erro: e.message }); }
});

router.put('/:id', exigirPerfil(...GESTORES), async (req, res) => {
  try {
    const r = await Rota.findByPk(req.params.id);
    if (!r) return res.status(404).json({ erro: 'Rota não encontrada' });
    await r.update(req.body);
    res.json(r);
  } catch (e) { res.status(400).json({ erro: e.message }); }
});

router.delete('/:id', exigirPerfil(...GESTORES), async (req, res) => {
  try {
    const r = await Rota.findByPk(req.params.id);
    if (!r) return res.status(404).json({ erro: 'Rota não encontrada' });
    await r.destroy();
    res.status(204).send();
  } catch (e) { res.status(500).json({ erro: e.message }); }
});

module.exports = router;
