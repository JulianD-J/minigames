// Historial simple de chat global y mensajes directos admin.
const messages = [];
const MAX_MESSAGES = 80;

function pushMessage(message) {
  messages.push({ ...message, createdAt: new Date().toISOString() });
  if (messages.length > MAX_MESSAGES) messages.shift();
}

function getRecentMessages(limit = 30) {
  return messages.slice(-limit);
}

module.exports = {
  pushMessage,
  getRecentMessages
};
