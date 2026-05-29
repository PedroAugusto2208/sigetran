const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt    = require('jsonwebtoken');
const { Usuario } = require('../models');

router.post('/login', async (req, res) => {
  try {
    const { login, senha } = req.body;
    if (!login || !senha) return res.status(400).json({ erro: 'Login e senha obrigatórios' });

    const usuario = await Usuario.findOne({ where: { login, ativo: true } });
    if (!usuario) return res.status(401).json({ erro: 'Credenciais inválidas' });

    const senhaOk = await bcrypt.compare(senha, usuario.senha);
    if (!senhaOk) return res.status(401).json({ erro: 'Credenciais inválidas' });

    const token = jwt.sign(
      { id: usuario.id, login: usuario.login, tipo: usuario.tipo, nome: usuario.nome },
      process.env.JWT_SECRET || 'sigetran_secret',
      { expiresIn: '8h' }
    );

    res.json({ token, usuario: { id: usuario.id, nome: usuario.nome, tipo: usuario.tipo } });
  } catch (e) {
    res.status(500).json({ erro: e.message });
  }
});

module.exports = router;
