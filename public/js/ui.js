// Módulo UI/HUD del juego: actualiza métricas y mini mapa.
export function updateHud(speed, lap) {
  document.getElementById('speed').textContent = Math.round(speed);
  document.getElementById('lap').textContent = lap;
}

export function drawMiniMap(ctx, players) {
  ctx.clearRect(0, 0, 150, 100);
  ctx.fillStyle = '#2d2d2d';
  ctx.fillRect(0, 0, 150, 100);
  players.forEach((p, idx) => {
    ctx.fillStyle = idx === 0 ? '#ffd166' : '#66e3ff';
    ctx.fillRect((p.x / 820) * 150, (p.y / 520) * 100, 4, 4);
  });
}
