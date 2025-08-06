const express = require('express');
const router = express.Router();
const { handleLogin } = require('../../controllers/auth/loginController');

//  登入邏輯
router.post('/login', handleLogin);

module.exports = router;
