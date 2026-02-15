// Middleware HTTP y Socket para autenticar jugadores y admins.
const { getSession, isRevoked } = require('../models/userModel');
const { parseCookies } = require('../utils/cookie');

function readAdminToken(req) {
  const headerToken = req.headers['x-admin-token'];
  if (headerToken) return headerToken;
  const cookies = parseCookies(req.headers.cookie || '');
  return cookies.admin_session;
}

function requireAdmin(req, res, next) {
  const token = readAdminToken(req);
  if (!token || token !== process.env.ADMIN_TOKEN) {
    return res.status(401).json({ error: 'Token admin inválido' });
  }
  return next();
}

function requireAdminPage(req, res, next) {
  const token = readAdminToken(req);
  if (token !== process.env.ADMIN_TOKEN) {
    return res.status(403).send('Acceso admin denegado');
  }
  return next();
}

function requirePlayer(req, res, next) {
  const token = req.headers['x-player-token'];
  const session = token ? getSession(token) : null;
  if (!session || isRevoked(session.u00)) {
    return res.status(401).json({ error: 'Sesión inválida o revocada' });
  }
  req.player = session;
  return next();
}

function socketAuth(socket, next) {
  const token = socket.handshake.auth?.token;
  const session = token ? getSession(token) : null;
  if (!session || isRevoked(session.u00)) {
    return next(new Error('No autorizado'));
  }
  socket.player = session;
  return next();
}

module.exports = {
  requireAdmin,
  requireAdminPage,
  requirePlayer,
  socketAuth
};
