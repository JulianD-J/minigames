// Modelo en memoria de salas de carrera y estado global del juego.
const rooms = new Map();

const globalState = {
  paused: false,
  chatMuted: false,
  freezeAll: false,
  track: 'Circuito Ciudad',
  powerUpRate: 1
};

function ensureRoom(roomId = 'lobby') {
  if (!rooms.has(roomId)) {
    rooms.set(roomId, {
      roomId,
      players: new Map(),
      raceState: 'waiting',
      lapGoal: 3,
      checkpoints: [{ x: 120, y: 120 }, { x: 700, y: 120 }, { x: 700, y: 420 }, { x: 120, y: 420 }]
    });
  }
  return rooms.get(roomId);
}

function addPlayer(roomId, player) {
  const room = ensureRoom(roomId);
  room.players.set(player.token, {
    ...player,
    x: 120,
    y: 120,
    angle: 0,
    speed: 0,
    lap: 1,
    checkpoint: 0,
    powerUps: [],
    ping: 0,
    status: 'active'
  });
  return room.players.get(player.token);
}

function removePlayer(roomId, token) {
  const room = ensureRoom(roomId);
  room.players.delete(token);
}

function updatePlayer(roomId, token, patch) {
  const room = ensureRoom(roomId);
  const current = room.players.get(token);
  if (!current) return null;
  const next = { ...current, ...patch };
  room.players.set(token, next);
  return next;
}

function getPlayers(roomId) {
  return Array.from(ensureRoom(roomId).players.values());
}

module.exports = {
  ensureRoom,
  addPlayer,
  removePlayer,
  updatePlayer,
  getPlayers,
  rooms,
  globalState
};
