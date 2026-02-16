// Controlador de autenticación por código U00 + alias.
const { normalizeU00, validateU00Format, sanitizeAlias } = require('../utils/u00Validator');
const { isRevoked, isBanned, createSession } = require('../models/userModel');

const ADMIN_U00 = 'U00130246';
const ADMIN_ALIAS = 'JulianD';

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

  const isAdmin = u00 === ADMIN_U00 && alias === ADMIN_ALIAS;
  const session = createSession({
    u00,
    alias,
    ip: req.ip,
    userAgent: req.headers['user-agent'] || 'unknown',
    isAdmin
  });

  if (isAdmin) {
    res.setHeader('Set-Cookie', `admin_player_token=${encodeURIComponent(session.token)}; HttpOnly; SameSite=Lax; Path=/; Max-Age=28800`);
  } else {
    // Garantiza que jugadores normales nunca carguen sesión admin previa.
    res.setHeader('Set-Cookie', 'admin_player_token=; HttpOnly; SameSite=Lax; Path=/; Max-Age=0');
  }

  return res.json({
    token: session.token,
    profile: {
      u00: session.u00,
      alias: session.alias,
      isAdmin: session.isAdmin,
      createdAt: session.createdAt
    }
  });
}

module.exports = { login };
