const express = require('express');
const router = express.Router();
const { handleRegister } = require('../../controllers/auth/registerController');

// 註冊邏輯
router.post('/register', handleRegister);

module.exports = router;
