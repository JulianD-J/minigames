// Lógica principal de canvas: predicción local, checkpoints, boost y render mejorado.
import { createSocket, sendInput } from './net.js';
import { updateHud, drawMiniMap, formatTime } from './ui.js';
import { bindChat } from './chat.js';

const token = localStorage.getItem('playerToken');
if (!token) location.href = '/';

const socket = createSocket(token);
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const minimapCtx = document.getElementById('minimap').getContext('2d');

const world = { width: canvas.width, height: canvas.height };
const checkpoints = [
  { x: 150, y: 120 },
  { x: 830, y: 120 },
  { x: 830, y: 440 },
  { x: 150, y: 440 }
];
const boostPads = [
  { x: 490, y: 120, r: 20 },
  { x: 830, y: 280, r: 20 },
  { x: 490, y: 440, r: 20 },
  { x: 150, y: 280, r: 20 }
];

const me = {
  x: 150,
  y: 120,
  angle: 0,
  speed: 0,
  lap: 1,
  checkpoint: 0,
  boostUntil: 0,
  startedAt: performance.now()
};

const others = new Map();
const keys = new Set();
let gameState = { paused: false };

window.addEventListener('keydown', (e) => keys.add(e.key));
window.addEventListener('keyup', (e) => keys.delete(e.key));
bindChat(socket);

document.getElementById('reportBtn').onclick = () => {
  const targetAlias = prompt('Alias a reportar');
  const reason = prompt('Motivo (se enviará solo emojis en chat, pero reportes admiten texto corto)');
  socket.emit('report:create', { targetAlias, reason });
};

socket.on('connect', () => socket.emit('ping:client', Date.now()));
socket.on('ping:server', (ping) => console.log('ping', ping));
socket.on('game:state', (s) => (gameState = s));
socket.on('player:state', (p) => others.set(p.token, p));
socket.on('players:update', (players) => players.forEach((p) => others.set(p.token, p)));
socket.on('race:finished', (data) => alert(`Ganador: ${data.alias} (${data.timeMs}ms)`));

socket.on('race:restart', () => {
  me.x = 150;
  me.y = 120;
  me.speed = 0;
  me.angle = 0;
  me.lap = 1;
  me.checkpoint = 0;
  me.boostUntil = 0;
  me.startedAt = performance.now();
});

function applyMovement(dt) {
  const baseAccel = 180;
  const steer = 2.8;
  const maxSpeed = Date.now() < me.boostUntil ? 320 : 240;

  if (keys.has('ArrowUp')) me.speed += baseAccel * dt;
  if (keys.has('ArrowDown')) me.speed -= baseAccel * dt * 0.8;
  me.speed *= 0.965;

  me.speed = Math.max(-120, Math.min(maxSpeed, me.speed));

  if (Math.abs(me.speed) > 5) {
    if (keys.has('ArrowLeft')) me.angle -= steer * dt;
    if (keys.has('ArrowRight')) me.angle += steer * dt;
  }

  me.x += Math.cos(me.angle) * me.speed * dt;
  me.y += Math.sin(me.angle) * me.speed * dt;

  me.x = Math.max(20, Math.min(world.width - 20, me.x));
  me.y = Math.max(20, Math.min(world.height - 20, me.y));
}

function checkBoostPads() {
  for (const pad of boostPads) {
    const dx = me.x - pad.x;
    const dy = me.y - pad.y;
    if (Math.hypot(dx, dy) < pad.r + 8) {
      me.boostUntil = Date.now() + 1400;
    }
  }
}

function checkCheckpointsAndLap() {
  const current = checkpoints[me.checkpoint];
  if (Math.hypot(me.x - current.x, me.y - current.y) < 40) {
    me.checkpoint = (me.checkpoint + 1) % checkpoints.length;
    if (me.checkpoint === 0) {
      me.lap = Math.min(3, me.lap + 1);
      if (me.lap === 3) {
        socket.emit('race:finish', { timeMs: performance.now() - me.startedAt });
      }
    }
  }
}

function update(dt) {
  if (gameState.paused) return;
  applyMovement(dt);
  checkBoostPads();
  checkCheckpointsAndLap();

  sendInput(socket, me);
  updateHud({
    speed: me.speed,
    lap: me.lap,
    timerText: formatTime(performance.now() - me.startedAt),
    boostActive: Date.now() < me.boostUntil
  });
}

function drawTrack() {
  const g = ctx.createLinearGradient(0, 0, 0, world.height);
  g.addColorStop(0, '#2f7b2f');
  g.addColorStop(1, '#1d5b27');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, world.width, world.height);

  ctx.strokeStyle = '#3e3f45';
  ctx.lineWidth = 86;
  ctx.strokeRect(150, 120, 680, 320);

  ctx.strokeStyle = '#f3f3f5';
  ctx.lineWidth = 3;
  ctx.setLineDash([14, 10]);
  ctx.strokeRect(150, 120, 680, 320);
  ctx.setLineDash([]);

  ctx.fillStyle = '#ffffff';
  ctx.fillRect(146, 110, 8, 22); // línea de salida

  boostPads.forEach((pad) => {
    ctx.beginPath();
    ctx.fillStyle = 'rgba(95,180,255,0.75)';
    ctx.arc(pad.x, pad.y, pad.r, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#d8f1ff';
    ctx.fillText('⚡', pad.x - 4, pad.y + 4);
  });
}

function drawKart(player, color) {
  ctx.save();
  ctx.translate(player.x, player.y);
  ctx.rotate(player.angle || 0);

  ctx.fillStyle = 'rgba(0,0,0,0.22)';
  ctx.fillRect(-10, 10, 22, 6);

  ctx.fillStyle = color;
  ctx.fillRect(-14, -9, 28, 18);
  ctx.fillStyle = '#111';
  ctx.fillRect(-12, -11, 7, 4);
  ctx.fillRect(5, -11, 7, 4);
  ctx.fillRect(-12, 9, 7, 4);
  ctx.fillRect(5, 9, 7, 4);
  ctx.restore();
}

function render() {
  ctx.clearRect(0, 0, world.width, world.height);
  drawTrack();
  drawKart(me, Date.now() < me.boostUntil ? '#ffe066' : '#ff595e');
  others.forEach((p) => drawKart(p, '#1982c4'));
  drawMiniMap(minimapCtx, [me, ...others.values()], world);
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
