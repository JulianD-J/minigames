// Tests de chat: solo emojis permitidos.
const { sanitizeChat } = require('../server/utils/chatFilter');

describe('chatFilter', () => {
  test('deja pasar emojis variados', () => {
    expect(sanitizeChat('😀🔥🚗🏁✨')).toBe('😀🔥🚗🏁✨');
    expect(sanitizeChat('👨‍👩‍👧‍👦 👍🏽')).toBe('👨‍👩‍👧‍👦 👍🏽');
  });

  test('elimina texto no emoji', () => {
    expect(sanitizeChat('hola 😀 test')).toBe('😀');
    expect(sanitizeChat('abc123')).toBe('');
  });
});
