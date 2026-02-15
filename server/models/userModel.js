// Modelo en memoria de usuarios, sesiones y estados de moderación.
const crypto = require('crypto');

const revoked = new Set();
const bannedUntil = new Map();
const sessions = new Map();

function isWhitelisted() {
  // Ya no se usa whitelist: cualquier U00 válido por formato puede entrar.
  return true;
}

function isRevoked(u00) {
  return revoked.has(u00);
}

function revokeU00(u00) {
  revoked.add(u00);
}

function unrevokeU00(u00) {
  revoked.delete(u00);
}

function banTemp(u00, minutes = 10) {
  const until = Date.now() + minutes * 60_000;
  bannedUntil.set(u00, until);
  return until;
}

function isBanned(u00) {
  const until = bannedUntil.get(u00);
  if (!until) return false;
  if (Date.now() > until) {
    bannedUntil.delete(u00);
    return false;
  }
  return true;
}

function createSession({ u00, alias, ip, userAgent }) {
  const token = crypto.randomUUID();
  const session = {
    token,
    u00,
    alias,
    ip,
    userAgent,
    createdAt: new Date().toISOString(),
    lastSeen: Date.now(),
    isFrozen: false
  };
  sessions.set(token, session);
  return session;
}

function getSession(token) {
  const session = sessions.get(token);
  if (session) session.lastSeen = Date.now();
  return session;
}

function removeSession(token) {
  sessions.delete(token);
}

function listSessions() {
  return Array.from(sessions.values());
}

function setFrozen(token, isFrozen) {
  const session = sessions.get(token);
  if (!session) return null;
  session.isFrozen = Boolean(isFrozen);
  return session;
}

module.exports = {
  isWhitelisted,
  isRevoked,
  revokeU00,
  unrevokeU00,
  banTemp,
  isBanned,
  createSession,
  getSession,
  removeSession,
  listSessions,
  setFrozen,
  _internal: { revoked, sessions, bannedUntil }
};
