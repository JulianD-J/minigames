// Tests unitarios para utilidades de validación U00.
const { validateU00Format, normalizeU00, sanitizeAlias } = require('../server/utils/u00Validator');

describe('u00Validator', () => {
  test('valida formato correcto', () => {
    expect(validateU00Format('U00123')).toBe(true);
    expect(validateU00Format('u00999')).toBe(true);
  });

  test('rechaza formato inválido', () => {
    expect(validateU00Format('X00123')).toBe(false);
    expect(validateU00Format('U0012')).toBe(false);
  });

  test('normaliza código y alias', () => {
    expect(normalizeU00(' u00123 ')).toBe('U00123');
    expect(sanitizeAlias('**Piloto🔥**')).toBe('Piloto');
  });
});
