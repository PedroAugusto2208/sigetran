const router = require('express').Router();
const { Carga } = require('../models');
const { autenticar, exigirPerfil } = require('../middleware/auth');

const GESTORES = ['ADMINISTRADOR', 'GESTOR_TRANSPORTE'];
router.use(autenticar);

router.get('/', async (req, res) => {
  try { res.json(await Carga.findAll({ order: [['createdAt', 'DESC']] })); }
  catch (e) { res.status(500).json({ erro: e.message }); }
});

router.get('/:id', async (req, res) => {
  try {
    const c = await Carga.findByPk(req.params.id);
    if (!c) return res.status(404).json({ erro: 'Carga não encontrada' });
    res.json(c);
  } catch (e) { res.status(500).json({ erro: e.message }); }
});

router.post('/', exigirPerfil(...GESTORES), async (req, res) => {
  try { res.status(201).json(await Carga.create(req.body)); }
  catch (e) { res.status(400).json({ erro: e.message }); }
});

router.put('/:id', exigirPerfil(...GESTORES), async (req, res) => {
  try {
    const c = await Carga.findByPk(req.params.id);
    if (!c) return res.status(404).json({ erro: 'Carga não encontrada' });
    await c.update(req.body);
    res.json(c);
  } catch (e) { res.status(400).json({ erro: e.message }); }
});

router.delete('/:id', exigirPerfil(...GESTORES), async (req, res) => {
  try {
    const c = await Carga.findByPk(req.params.id);
    if (!c) return res.status(404).json({ erro: 'Carga não encontrada' });
    await c.destroy();
    res.status(204).send();
  } catch (e) { res.status(500).json({ erro: e.message }); }
});

module.exports = router;
