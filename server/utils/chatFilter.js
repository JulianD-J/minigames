// Filtro de chat: solo permite emojis (cualquiera) y sus modificadores Unicode.
function sanitizeChat(text = '') {
  const trimmed = String(text).trim().slice(0, 140);
  const chars = Array.from(trimmed);

  const filtered = chars.filter((ch) => {
    // Emojis y componentes válidos para secuencias (ZWJ, VS16, tonos de piel, keycap).
    return /\p{Extended_Pictographic}|\p{Emoji_Presentation}|[\u200D\uFE0F\u20E3\u{1F3FB}-\u{1F3FF}]|\s/gu.test(ch);
  });

  // Evita mensajes solo con espacios.
  return filtered.join('').trim();
}

module.exports = { sanitizeChat };
