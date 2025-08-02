// routes/setAdminVerified.js
const express = require('express');
const router = express.Router();

router.post('/', (req, res) => {
  if (req.session.user && req.session.user.role === 'admin') {
    req.session.user.adminVerified = true;
    return res.json({ status: 'success', message: '✅ 已設定 admin 驗證狀態' });
  }

  return res.status(403).json({ status: 'fail', message: '❌ 未授權，只有 admin 可設定' });
});

module.exports = router;
