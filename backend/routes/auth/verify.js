// routes/auth/verify.js
const express = require('express');
const router = express.Router();
const { handleVerify } = require('../../controllers/auth/verifyController');

router.post('/verify-email-code', handleVerify);

module.exports = router;
