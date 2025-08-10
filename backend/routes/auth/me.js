const express = require('express');
const router = express.Router();
const { handleCheckMe } = require('../../controllers/auth/meController');

// 檢查登入狀態
router.get('/me', handleCheckMe);

module.exports = router;
