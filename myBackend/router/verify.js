// ✅ router/verify.js  驗證輸入的Email驗證碼是否正確

const express = require('express');
const router = express.Router();
const { verificationCodes } = require('./shared');

router.post('/verify-email-code', (req, res) => {
  const { email, code } = req.body;
  const validCode = verificationCodes[email];

  if (validCode && validCode === code) {
    delete verificationCodes[email];
    res.json({ status: 'success' });
  } else {
    res.json({ status: 'fail' });
  }
});

module.exports = router;