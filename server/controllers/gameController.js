// Lógica Socket.IO para sincronización de carrera, chat y reportes.
const { ensureRoom, addPlayer, removePlayer, updatePlayer, getPlayers, globalState } = require('../models/roomModel');
const { addReport } = require('../models/reportModel');
const { pushMessage } = require('../models/chatModel');
const { sanitizeChat } = require('../utils/chatFilter');

function wireGameEvents(io, socket) {
  const roomId = 'lobby';
  ensureRoom(roomId);
  socket.join(roomId);

  addPlayer(roomId, {
    token: socket.player.token,
    alias: socket.player.alias,
    u00: socket.player.u00
  });

  io.to(roomId).emit('players:update', getPlayers(roomId));
  socket.emit('game:state', globalState);

  socket.on('ping:client', (clientTime) => {
    const ping = Math.max(1, Date.now() - clientTime);
    updatePlayer(roomId, socket.player.token, { ping });
    socket.emit('ping:server', ping);
  });

  socket.on('player:input', (payload) => {
    if (globalState.paused || globalState.freezeAll || socket.player.isFrozen) return;
    const safe = {
      x: Number(payload.x) || 120,
      y: Number(payload.y) || 120,
      angle: Number(payload.angle) || 0,
      speed: Number(payload.speed) || 0,
      lap: Number(payload.lap) || 1,
      checkpoint: Number(payload.checkpoint) || 0
    };
    const player = updatePlayer(roomId, socket.player.token, safe);
    if (player) socket.to(roomId).emit('player:state', player);
  });

  socket.on('race:finish', ({ timeMs }) => {
    io.to(roomId).emit('race:finished', {
      alias: socket.player.alias,
      u00: socket.player.u00,
      timeMs: Number(timeMs) || 0
    });
  });

  socket.on('chat:global', (text) => {
    if (globalState.chatMuted) return;
    const clean = sanitizeChat(text);
    if (!clean) return;
    const msg = { type: 'global', from: socket.player.alias, to: null, text: clean };
    pushMessage(msg);
    io.to(roomId).emit('chat:message', msg);
  });

  socket.on('report:create', ({ targetAlias, reason }) => {
    const report = addReport({
      reporter: socket.player.alias,
      reporterU00: socket.player.u00,
      targetAlias,
      reason: sanitizeChat(reason)
    });
    socket.emit('report:ok', report);
    io.emit('admin:report', report);
  });

  socket.on('disconnect', () => {
    removePlayer(roomId, socket.player.token);
    io.to(roomId).emit('players:update', getPlayers(roomId));
  });
}

module.exports = { wireGameEvents };
