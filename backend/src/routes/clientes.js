const router = require('express').Router();
const { Cliente } = require('../models');
const { autenticar, exigirPerfil } = require('../middleware/auth');

const GESTORES = ['ADMINISTRADOR', 'GESTOR_TRANSPORTE'];
router.use(autenticar);

router.get('/', async (req, res) => {
  try { res.json(await Cliente.findAll({ order: [['nome', 'ASC']] })); }
  catch (e) { res.status(500).json({ erro: e.message }); }
});

router.get('/:id', async (req, res) => {
  try {
    const c = await Cliente.findByPk(req.params.id);
    if (!c) return res.status(404).json({ erro: 'Cliente não encontrado' });
    res.json(c);
  } catch (e) { res.status(500).json({ erro: e.message }); }
});

router.post('/', exigirPerfil(...GESTORES), async (req, res) => {
  try { res.status(201).json(await Cliente.create(req.body)); }
  catch (e) {
    if (e.name === 'SequelizeUniqueConstraintError')
      return res.status(409).json({ erro: 'CPF/CNPJ já cadastrado' });
    res.status(400).json({ erro: e.message });
  }
});

router.put('/:id', exigirPerfil(...GESTORES), async (req, res) => {
  try {
    const c = await Cliente.findByPk(req.params.id);
    if (!c) return res.status(404).json({ erro: 'Cliente não encontrado' });
    await c.update(req.body);
    res.json(c);
  } catch (e) { res.status(400).json({ erro: e.message }); }
});

router.delete('/:id', exigirPerfil(...GESTORES), async (req, res) => {
  try {
    const c = await Cliente.findByPk(req.params.id);
    if (!c) return res.status(404).json({ erro: 'Cliente não encontrado' });
    await c.destroy();
    res.status(204).send();
  } catch (e) { res.status(500).json({ erro: e.message }); }
});

module.exports = router;
