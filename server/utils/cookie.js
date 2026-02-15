// Utilidad mínima para leer cookies sin dependencias externas.
function parseCookies(cookieHeader = '') {
  return cookieHeader
    .split(';')
    .map((part) => part.trim())
    .filter(Boolean)
    .reduce((acc, part) => {
      const i = part.indexOf('=');
      if (i === -1) return acc;
      const key = part.slice(0, i);
      const value = decodeURIComponent(part.slice(i + 1));
      acc[key] = value;
      return acc;
    }, {});
}

module.exports = { parseCookies };
