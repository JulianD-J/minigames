// Controlador de autenticación por código U00 + alias.
const { normalizeU00, validateU00Format, sanitizeAlias } = require('../utils/u00Validator');
const { isRevoked, isBanned, createSession } = require('../models/userModel');

function login(req, res) {
  const u00 = normalizeU00(req.body.u00);
  const alias = sanitizeAlias(req.body.alias);

  if (!validateU00Format(u00)) {
    return res.status(400).json({ error: 'Formato U00 inválido (usa U00 + 6 dígitos)' });
  }
  if (isRevoked(u00)) {
    return res.status(403).json({ error: 'Código U00 revocado' });
  }
  if (isBanned(u00)) {
    return res.status(403).json({ error: 'U00 baneado temporalmente' });
  }

  const session = createSession({
    u00,
    alias,
    ip: req.ip,
    userAgent: req.headers['user-agent'] || 'unknown'
  });

  return res.json({
    token: session.token,
    profile: {
      u00: session.u00,
      alias: session.alias,
      createdAt: session.createdAt
    }
  });
}

module.exports = { login };
