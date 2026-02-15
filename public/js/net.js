// Módulo de red cliente: maneja conexión Socket.IO y helpers de envío.
export function createSocket(token) {
  return io({ auth: { token } });
}

export function sendInput(socket, state) {
  socket.emit('player:input', state);
}
