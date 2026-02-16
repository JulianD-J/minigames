// Controlador para cerrar sesión admin (única sesión creada por login U00+alias admin).
function destroyAdminSession(req, res) {
  res.setHeader('Set-Cookie', 'admin_player_token=; HttpOnly; SameSite=Lax; Path=/; Max-Age=0');
  return res.json({ ok: true });
}

module.exports = {
  destroyAdminSession
};
