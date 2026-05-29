const router = require('express').Router();
const bcrypt = require('bcryptjs');
const { Usuario } = require('../models');
const { autenticar, exigirPerfil } = require('../middleware/auth');

router.use(autenticar);
router.use(exigirPerfil('ADMINISTRADOR'));

router.get('/', async (req, res) => {
  try {
    const lista = await Usuario.findAll({
      attributes: { exclude: ['senha'] },
      order: [['nome', 'ASC']],
    });
    res.json(lista);
  } catch (e) { res.status(500).json({ erro: e.message }); }
});

router.get('/:id', async (req, res) => {
  try {
    const u = await Usuario.findByPk(req.params.id, { attributes: { exclude: ['senha'] } });
    if (!u) return res.status(404).json({ erro: 'Usuário não encontrado' });
    res.json(u);
  } catch (e) { res.status(500).json({ erro: e.message }); }
});

router.post('/', async (req, res) => {
  try {
    const { senha, ...resto } = req.body;
    const hash = await bcrypt.hash(senha, 10);
    const u = await Usuario.create({ ...resto, senha: hash });
    const { senha: _, ...sem } = u.toJSON();
    res.status(201).json(sem);
  } catch (e) {
    if (e.name === 'SequelizeUniqueConstraintError')
      return res.status(409).json({ erro: 'Login já cadastrado' });
    res.status(400).json({ erro: e.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const u = await Usuario.findByPk(req.params.id);
    if (!u) return res.status(404).json({ erro: 'Usuário não encontrado' });
    const dados = { ...req.body };
    if (dados.senha) dados.senha = await bcrypt.hash(dados.senha, 10);
    await u.update(dados);
    const { senha: _, ...sem } = u.toJSON();
    res.json(sem);
  } catch (e) { res.status(400).json({ erro: e.message }); }
});

router.delete('/:id', async (req, res) => {
  try {
    const u = await Usuario.findByPk(req.params.id);
    if (!u) return res.status(404).json({ erro: 'Usuário não encontrado' });
    await u.destroy();
    res.status(204).send();
  } catch (e) { res.status(500).json({ erro: e.message }); }
});

module.exports = router;
