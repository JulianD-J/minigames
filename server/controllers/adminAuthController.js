// Controlador para iniciar/cerrar sesión admin vía cookie HttpOnly.
function createAdminSession(req, res) {
  const { token } = req.body || {};
  if (!token || token !== process.env.ADMIN_TOKEN) {
    return res.status(401).json({ error: 'Token admin inválido' });
  }

  res.setHeader('Set-Cookie', `admin_session=${encodeURIComponent(token)}; HttpOnly; SameSite=Lax; Path=/; Max-Age=28800`);
  return res.json({ ok: true });
}

function destroyAdminSession(req, res) {
  res.setHeader('Set-Cookie', 'admin_session=; HttpOnly; SameSite=Lax; Path=/; Max-Age=0');
  return res.json({ ok: true });
}

module.exports = {
  createAdminSession,
  destroyAdminSession
};
