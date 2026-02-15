// Modelo en memoria para almacenar reportes de jugadores.
const reports = [];

function addReport(payload) {
  const report = {
    id: reports.length + 1,
    createdAt: new Date().toISOString(),
    ...payload
  };
  reports.push(report);
  return report;
}

function listReports(limit = 100) {
  return reports.slice(-limit).reverse();
}

module.exports = {
  addReport,
  listReports,
  _internal: { reports }
};
