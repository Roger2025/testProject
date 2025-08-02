const express = require('express');
const router = express.Router();
const { verificationCodes } = require('./shared');

router.post('/verify-email-code', (req, res) => {
  const { email, code } = req.body;
  const record = verificationCodes[email];

  if (!record) {
    // 尚未寄送或驗證碼已被刪除（成功過一次）
    return res.json({
      status: 'fail',
      message: '❌ 尚未發送驗證碼或驗證碼已失效，請重新登入。'
    });
  }

  if (Date.now() > record.expiresAt) {
    // 驗證碼過期
    delete verificationCodes[email]; // 過期自動清除
    return res.json({
      status: 'fail',
      message: '❌ 驗證碼已過期，請重新登入以獲得新的驗證碼。'
    });
  }

  // 驗證碼正確性
  if (record.code !== code) {
    return res.json({
      status: 'fail',
      message: '❌ 驗證碼錯誤，請重新輸入。'
    });
  }

  //  驗證成功：記錄到 session
  req.session.user.adminVerified = true;
  console.log('✅ 驗證後的 session 狀態:', req.session);

  // 驗證成功
  delete verificationCodes[email];
  res.json({ status: 'success', message: '✅ 驗證成功！' });
});

module.exports = router;
