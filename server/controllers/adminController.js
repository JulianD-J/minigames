// Controlador HTTP para acciones administrativas sobre jugadores y juego.
const { listSessions, revokeU00, banTemp, setFrozen } = require('../models/userModel');
const { getPlayers, updatePlayer, globalState } = require('../models/roomModel');
const { listReports } = require('../models/reportModel');
const { getRecentMessages } = require('../models/chatModel');

function listPlayers(req, res) {
  const sessions = listSessions();
  const racers = getPlayers('lobby');
  const players = sessions.map((session) => {
    const racer = racers.find((r) => r.token === session.token);
    return {
      alias: session.alias,
      u00: session.u00,
      token: session.token,
      ping: racer?.ping ?? 0,
      powerUps: racer?.powerUps ?? [],
      status: racer?.status ?? 'offline',
      isFrozen: session.isFrozen
    };
  });
  return res.json({ players, globalState });
}

function revokeCode(req, res) {
  revokeU00(req.body.u00);
  return res.json({ ok: true, revoked: req.body.u00 });
}

function freezePlayer(req, res) {
  const { token, frozen } = req.body;
  const session = setFrozen(token, frozen);
  if (!session) return res.status(404).json({ error: 'Jugador no encontrado' });
  updatePlayer('lobby', token, { status: frozen ? 'frozen' : 'active' });
  return res.json({ ok: true, token, frozen: Boolean(frozen) });
}

function banPlayer(req, res) {
  const { u00, minutes } = req.body;
  const until = banTemp(u00, Number(minutes) || 10);
  return res.json({ ok: true, u00, until });
}

function panic(req, res) {
  globalState.paused = true;
  globalState.chatMuted = true;
  globalState.freezeAll = true;
  return res.json({ ok: true, globalState });
}

function gameControl(req, res) {
  const { action, value } = req.body;
  if (action === 'pause') globalState.paused = true;
  if (action === 'resume') globalState.paused = false;
  if (action === 'track') globalState.track = value || globalState.track;
  if (action === 'restart') globalState.paused = false;
  if (action === 'powerUps') globalState.powerUpRate = Number(value) || 1;
  return res.json({ ok: true, globalState });
}

function getReports(req, res) {
  return res.json({ reports: listReports(100) });
}

function getChatHistory(req, res) {
  return res.json({ messages: getRecentMessages(30) });
}

module.exports = {
  listPlayers,
  revokeCode,
  freezePlayer,
  banPlayer,
  panic,
  gameControl,
  getReports,
  getChatHistory
};
