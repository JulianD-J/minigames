// Utilidades para validar código U00 y sanitizar alias.
const U00_REGEX = /^U00\d{3}$/;

function normalizeU00(code = '') {
  return code.trim().toUpperCase();
}

function validateU00Format(code) {
  return U00_REGEX.test(normalizeU00(code));
}

function sanitizeAlias(alias = '') {
  return alias.replace(/[^\p{L}\p{N}_\-\s]/gu, '').trim().slice(0, 16) || 'Piloto';
}

module.exports = {
  normalizeU00,
  validateU00Format,
  sanitizeAlias
};
