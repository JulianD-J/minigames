// Filtro básico para chat: bloquea caracteres no permitidos y limita emojis.
const allowedEmoji = new Set(['😀', '😎', '🔥', '🚗', '🏁', '👍']);

function sanitizeChat(text = '') {
  const trimmed = text.trim().slice(0, 140);
  const chars = Array.from(trimmed);
  const filtered = chars.filter((ch) => /[\p{L}\p{N}\s.,!?_-]/u.test(ch) || allowedEmoji.has(ch));
  return filtered.join('');
}

module.exports = { sanitizeChat, allowedEmoji };
