// Endpoints protegidos para consola admin.
const express = require('express');
const { requireAdmin } = require('../middleware/authMiddleware');
const { createAdminSession, destroyAdminSession } = require('../controllers/adminAuthController');
const {
  listPlayers,
  revokeCode,
  freezePlayer,
  banPlayer,
  panic,
  gameControl,
  getReports,
  getChatHistory
} = require('../controllers/adminController');

const router = express.Router();

// Login/logout de sesión admin (cookie HttpOnly).
router.post('/session', createAdminSession);
router.delete('/session', destroyAdminSession);

router.use(requireAdmin);
router.get('/players', listPlayers);
router.post('/revoke', revokeCode);
router.post('/freeze', freezePlayer);
router.post('/ban', banPlayer);
router.post('/panic', panic);
router.post('/game-control', gameControl);
router.get('/reports', getReports);
router.get('/chat-history', getChatHistory);

module.exports = router;
