// Lógica principal de canvas: predicción local, interpolación remota y eventos de juego.
import { createSocket, sendInput } from './net.js';
import { updateHud, drawMiniMap } from './ui.js';
import { bindChat } from './chat.js';

const token = localStorage.getItem('playerToken');
if (!token) location.href = '/';

const socket = createSocket(token);
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const minimapCtx = document.getElementById('minimap').getContext('2d');

const me = { x: 120, y: 120, angle: 0, speed: 0, lap: 1, checkpoint: 0 };
const others = new Map();
const keys = new Set();
let gameState = { paused: false };

window.addEventListener('keydown', (e) => keys.add(e.key));
window.addEventListener('keyup', (e) => keys.delete(e.key));

bindChat(socket);

document.getElementById('reportBtn').onclick = () => {
  const targetAlias = prompt('Alias a reportar');
  const reason = prompt('Motivo');
  socket.emit('report:create', { targetAlias, reason });
};

socket.on('connect', () => socket.emit('ping:client', Date.now()));
socket.on('ping:server', (ping) => console.log('ping', ping));
socket.on('game:state', (s) => (gameState = s));
socket.on('player:state', (p) => others.set(p.token, p));
socket.on('players:update', (players) => {
  players.forEach((p) => others.set(p.token, p));
});
socket.on('race:finished', (data) => alert(`Ganador: ${data.alias} (${data.timeMs}ms)`));

function update(dt) {
  if (gameState.paused) return;
  const accel = 120;
  if (keys.has('ArrowUp')) me.speed += accel * dt;
  if (keys.has('ArrowDown')) me.speed -= accel * dt;
  me.speed *= 0.96;
  if (keys.has('ArrowLeft')) me.angle -= 2.4 * dt;
  if (keys.has('ArrowRight')) me.angle += 2.4 * dt;

  me.x += Math.cos(me.angle) * me.speed * dt;
  me.y += Math.sin(me.angle) * me.speed * dt;
  me.x = Math.max(10, Math.min(canvas.width - 10, me.x));
  me.y = Math.max(10, Math.min(canvas.height - 10, me.y));

  if (me.x > 790 && me.y > 490) {
    me.lap = Math.min(3, me.lap + 1);
    if (me.lap === 3) socket.emit('race:finish', { timeMs: performance.now() | 0 });
  }

  sendInput(socket, me);
  updateHud(me.speed, me.lap);
}

function render() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = '#2f7b2f';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = '#444';
  ctx.lineWidth = 36;
  ctx.strokeRect(80, 80, 660, 360);

  // Kart local (predicción cliente).
  drawKart(me, '#ff595e');
  // Karts remotos interpolados (placeholder simple).
  others.forEach((p) => drawKart(p, '#1982c4'));
  drawMiniMap(minimapCtx, [me, ...others.values()]);
}

function drawKart(player, color) {
  ctx.save();
  ctx.translate(player.x, player.y);
  ctx.rotate(player.angle || 0);
  ctx.fillStyle = color;
  ctx.fillRect(-12, -8, 24, 16);
  ctx.fillStyle = '#000';
  ctx.fillRect(-10, -10, 6, 4);
  ctx.fillRect(4, -10, 6, 4);
  ctx.restore();
}

let last = performance.now();
function loop(now) {
  const dt = Math.min(0.033, (now - last) / 1000);
  last = now;
  update(dt);
  render();
  requestAnimationFrame(loop);
}
requestAnimationFrame(loop);
