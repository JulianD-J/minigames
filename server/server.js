// Servidor principal Express + Socket.IO para el juego y panel admin.
require('dotenv').config();
const path = require('path');
const http = require('http');
const express = require('express');
const { Server } = require('socket.io');
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const { socketAuth, requireAdminPage } = require('./middleware/authMiddleware');
const { wireGameEvents } = require('./controllers/gameController');
const { wireAdminConsole } = require('./adminConsole');

function createApp() {
  const app = express();
  app.use(express.json());

  app.get('/health', (req, res) => res.json({ ok: true }));
  app.use('/api', authRoutes);
  app.use('/api/admin', adminRoutes);

  // Bloquea acceso directo a la vista admin si no existe cookie de sesión admin válida.
  app.get('/admin.html', requireAdminPage, (req, res) => {
    res.sendFile(path.join(__dirname, '../public/admin.html'));
  });

  app.use(express.static(path.join(__dirname, '../public')));

  return app;
}

function createServer() {
  const app = createApp();
  const server = http.createServer(app);
  const io = new Server(server, { cors: { origin: '*' } });
  app.set('io', io);

  io.use(socketAuth);
  io.on('connection', (socket) => {
    wireGameEvents(io, socket);
    wireAdminConsole(io, socket);
  });

  return { app, server, io };
}

if (require.main === module) {
  const { server } = createServer();
  const port = Number(process.env.PORT || 3000);
  server.listen(port, () => {
    console.log(`[server] Running on http://localhost:${port}`);
  });
}

module.exports = { createApp, createServer };
