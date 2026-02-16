// Middleware HTTP y Socket para autenticar jugadores y admins.
const { getSession, isRevoked } = require('../models/userModel');
const { parseCookies } = require('../utils/cookie');

function readAdminSession(req) {
  const cookies = parseCookies(req.headers.cookie || '');
  const token = cookies.admin_player_token;
  return token ? getSession(token) : null;
}

function requireAdmin(req, res, next) {
  const adminSession = readAdminSession(req);
  if (!adminSession || !adminSession.isAdmin || isRevoked(adminSession.u00)) {
    return res.status(401).json({ error: 'Acceso admin inválido' });
  }
  req.admin = adminSession;
  return next();
}

function requireAdminPage(req, res, next) {
  const adminSession = readAdminSession(req);
  if (!adminSession || !adminSession.isAdmin || isRevoked(adminSession.u00)) {
    return res.status(403).send('Acceso admin denegado');
  }
  req.admin = adminSession;
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
