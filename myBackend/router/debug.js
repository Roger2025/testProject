const express = require('express');
const router = express.Router();
const { roleCheck } = require('../middlewares/roleCheck');

// ✅ 不限制角色：只要有登入就能取得目前角色
router.get('/whoami', (req, res) => {
  if (!req.user) {
    return res.status(401).json({ status: 'unauthorized', message: '尚未登入' });
  }

  res.json({
    status: 'success',
    message: '這是目前登入者資訊',
    user: req.user
  });
});

// ✅ 模擬測試：只有 admin 和 shop 可以通過
router.get('/test-role-check', roleCheck(['admin', 'shop']), (req, res) => {
  res.json({
    status: 'success',
    message: `✅ 通過權限驗證，你的角色是：${req.user.role}`
  });
});

module.exports = router;
