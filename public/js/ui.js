// Módulo UI/HUD del juego: actualiza métricas y mini mapa.
export function updateHud({ speed, lap, timerText, boostActive }) {
  document.getElementById('speed').textContent = Math.max(0, Math.round(speed));
  document.getElementById('lap').textContent = lap;
  document.getElementById('timer').textContent = timerText;
  document.getElementById('boost').textContent = boostActive ? 'Sí ⚡' : 'No';
}

export function drawMiniMap(ctx, players, world) {
  ctx.clearRect(0, 0, 180, 110);
  ctx.fillStyle = '#1b2c1d';
  ctx.fillRect(0, 0, 180, 110);

  // Trazo del circuito.
  ctx.strokeStyle = '#99a6bf';
  ctx.lineWidth = 10;
  ctx.strokeRect(20, 16, 140, 78);

  players.forEach((p, idx) => {
    ctx.fillStyle = idx === 0 ? '#ffd166' : '#66e3ff';
    const x = (p.x / world.width) * 180;
    const y = (p.y / world.height) * 110;
    ctx.beginPath();
    ctx.arc(x, y, 2.7, 0, Math.PI * 2);
    ctx.fill();
  });
}

export function formatTime(ms) {
  const totalSec = Math.floor(ms / 1000);
  const m = String(Math.floor(totalSec / 60)).padStart(2, '0');
  const s = String(totalSec % 60).padStart(2, '0');
  return `${m}:${s}`;
}
