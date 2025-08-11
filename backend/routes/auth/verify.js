const express = require('express');
const router = express.Router();
const { handleVerify } = require('../../controllers/auth/verifyController');

// 驗證email邏輯
router.post('/verify-email-code', handleVerify);

module.exports = router;
