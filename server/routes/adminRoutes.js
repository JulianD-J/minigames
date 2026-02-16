// Endpoints protegidos para consola admin.
const express = require('express');
const { requireAdmin } = require('../middleware/authMiddleware');
const { destroyAdminSession } = require('../controllers/adminAuthController');
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

// Logout de sesión admin.
router.delete('/logout', destroyAdminSession);

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
