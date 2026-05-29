const router = require('express').Router();
const { Motorista } = require('../models');
const { autenticar, exigirPerfil } = require('../middleware/auth');

const GESTORES = ['ADMINISTRADOR', 'GESTOR_TRANSPORTE'];
router.use(autenticar);

router.get('/', async (req, res) => {
  try { res.json(await Motorista.findAll({ order: [['nome', 'ASC']] })); }
  catch (e) { res.status(500).json({ erro: e.message }); }
});

router.get('/:id', async (req, res) => {
  try {
    const m = await Motorista.findByPk(req.params.id);
    if (!m) return res.status(404).json({ erro: 'Motorista não encontrado' });
    res.json(m);
  } catch (e) { res.status(500).json({ erro: e.message }); }
});

router.post('/', exigirPerfil(...GESTORES), async (req, res) => {
  try {
    res.status(201).json(await Motorista.create(req.body));
  } catch (e) {
    if (e.name === 'SequelizeUniqueConstraintError')
      return res.status(409).json({ erro: 'CPF ou CNH já cadastrado' });
    res.status(400).json({ erro: e.message });
  }
});

router.put('/:id', exigirPerfil(...GESTORES), async (req, res) => {
  try {
    const m = await Motorista.findByPk(req.params.id);
    if (!m) return res.status(404).json({ erro: 'Motorista não encontrado' });
    await m.update(req.body);
    res.json(m);
  } catch (e) { res.status(400).json({ erro: e.message }); }
});

router.delete('/:id', exigirPerfil(...GESTORES), async (req, res) => {
  try {
    const m = await Motorista.findByPk(req.params.id);
    if (!m) return res.status(404).json({ erro: 'Motorista não encontrado' });
    await m.destroy();
    res.status(204).send();
  } catch (e) { res.status(500).json({ erro: e.message }); }
});

module.exports = router;
