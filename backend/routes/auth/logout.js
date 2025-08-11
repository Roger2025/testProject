const express = require('express');
const router = express.Router();
const { handleLogout } = require('../../controllers/auth/logoutController');

//  登出 API
router.post('/logout', handleLogout);

module.exports = router;
