// Eventos Socket dedicados a la consola admin para control en vivo.
const { globalState, updatePlayer, getPlayers } = require('./models/roomModel');
const { pushMessage } = require('./models/chatModel');
const { sanitizeChat } = require('./utils/chatFilter');

function wireAdminConsole(io, socket) {
  if (!socket.handshake.auth?.adminToken || socket.handshake.auth.adminToken !== process.env.ADMIN_TOKEN) {
    return;
  }

  socket.join('admins');
  socket.emit('admin:init', { globalState, players: getPlayers('lobby') });

  socket.on('admin:dm', ({ token, text }) => {
    const clean = sanitizeChat(text);
    if (!clean) return;
    const msg = { type: 'dm-admin', from: 'ADMIN', to: token, text: clean };
    pushMessage(msg);
    io.to('admins').emit('chat:message', msg);
    io.to('lobby').emit('admin:dm', msg);
  });

  socket.on('admin:teleport', ({ token }) => {
    const player = updatePlayer('lobby', token, { x: 120, y: 120, checkpoint: 0 });
    if (player) io.to('lobby').emit('player:state', player);
  });

  socket.on('admin:game', ({ paused, muted, freezeAll }) => {
    if (typeof paused === 'boolean') globalState.paused = paused;
    if (typeof muted === 'boolean') globalState.chatMuted = muted;
    if (typeof freezeAll === 'boolean') globalState.freezeAll = freezeAll;
    io.to('lobby').emit('game:state', globalState);
  });
}

module.exports = { wireAdminConsole };
