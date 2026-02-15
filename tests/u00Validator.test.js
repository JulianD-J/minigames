// Tests unitarios para utilidades de validación U00.
const { validateU00Format, normalizeU00, sanitizeAlias } = require('../server/utils/u00Validator');

describe('u00Validator', () => {
  test('valida formato correcto', () => {
    expect(validateU00Format('U00123456')).toBe(true);
    expect(validateU00Format('u00111111')).toBe(true);
  });

  test('rechaza formato inválido', () => {
    expect(validateU00Format('X00123456')).toBe(false);
    expect(validateU00Format('U0012345')).toBe(false);
  });

  test('normaliza código y alias', () => {
    expect(normalizeU00(' u00123456 ')).toBe('U00123456');
    expect(sanitizeAlias('**Piloto🔥**')).toBe('Piloto');
  });
});
