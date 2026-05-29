const jwt = require('jsonwebtoken');

function autenticar(req, res, next) {
  const header = req.headers.authorization;
  if (!header) return res.status(401).json({ erro: 'Token não fornecido' });

  const token = header.split(' ')[1];
  try {
    req.usuario = jwt.verify(token, process.env.JWT_SECRET || 'sigetran_secret');
    next();
  } catch {
    res.status(401).json({ erro: 'Token inválido ou expirado' });
  }
}

function exigirPerfil(...perfis) {
  return (req, res, next) => {
    if (!perfis.includes(req.usuario.tipo)) {
      return res.status(403).json({ erro: 'Acesso não autorizado para este perfil' });
    }
    next();
  };
}

module.exports = { autenticar, exigirPerfil };
