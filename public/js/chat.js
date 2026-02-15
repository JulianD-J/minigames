// Módulo chat cliente: envío global con emojis y render de mensajes.
export function bindChat(socket) {
  const log = document.getElementById('chatLog');
  const input = document.getElementById('chatInput');

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      socket.emit('chat:global', input.value);
      input.value = '';
    }
  });

  socket.on('chat:message', (msg) => {
    const p = document.createElement('p');
    p.textContent = `${msg.from}: ${msg.text}`;
    log.appendChild(p);
    log.scrollTop = log.scrollHeight;
  });

  socket.on('admin:dm', (msg) => {
    const p = document.createElement('p');
    p.textContent = `[DM ADMIN] ${msg.text}`;
    p.style.color = '#ffd166';
    log.appendChild(p);
  });
}
