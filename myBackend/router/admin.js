const express = require('express');
const router = express.Router();
const { roleCheck } = require('../middlewares/roleCheck'); // ✅ 匯入
const { users } = require('./shared');

// ✅ 管理者才能存取：查看機密資料
router.get('/admin-only-data', roleCheck(['admin']), (req, res) => {
  console.log('✅ 進入 admin-only-data 路由');
  res.json({
    status: 'success',
    message: '這是管理者專屬資料',
    user: req.user //  回傳當前登入者資訊（方便前端除錯）
  });
});

//  商家或管理者都能操作：新增商品
router.post('/create-product', roleCheck(['shop', 'admin']), (req, res) => {
  // 這裡未來可以接收 req.body 做新增商品邏輯
  res.json({
    status: 'success',
    message: '新增商品成功',
    by: req.user?.role || 'unknown'
  });
});

// routes/admin.js
router.get('/pending-users', roleCheck(['admin']), (req, res) => {
  //const { users } = require('./shared');
  console.log(users)
  const pendingUsers = users.filter(u => u.role === 'pending');
  res.json({ status: 'success', users: pendingUsers });
});

// routes/admin.js
router.patch('/approve-user/:account', roleCheck(['admin']), (req, res) => { //:account動態路由參數
  const targetAccount = req.params.account;

  const user = users.find(u => u.account === targetAccount);

  if (!user) {
    return res.status(404).json({ status: 'fail', message: '找不到此帳號' });
  }

  if (user.role !== 'pending') {
    return res.json({ status: 'fail', message: '該帳號不在審核狀態' });
  }

  user.role = 'shop';

  res.json({ status: 'success', message: `✅ 帳號 ${targetAccount} 已審核通過並設為 shop`, user });
});

// ✅ 取得所有使用者
router.get('/all-users', roleCheck(['admin']), (req, res) => {
  res.json({ status: 'success', users });
});

// ✅ 軟刪除 
router.delete('/delete-user/:account', roleCheck(['admin']), (req, res) => {
  const target = req.params.account;
  const user = users.find(u => u.account === target); // ✅ 改用 find（不刪掉陣列資料）

  if (!user) {
    return res.status(404).json({ status: 'fail', message: '找不到使用者' });
  }

  if (user.role === 'admin') {
    return res.status(403).json({ status: 'fail', message: '❌ 不能停權管理者帳號' });
  }

  user.status = 'disabled'; // ✅ 軟刪除：標記狀態為停權

  res.json({
    status: 'success',
    message: `✅ 已將帳號 ${target} 停權（軟刪除）`,
    user
  });
});

// ✅ 恢復使用者帳號
router.patch('/restore-user/:account', roleCheck(['admin']), (req, res) => {
  const targetAccount = req.params.account;
  const user = users.find(u => u.account === targetAccount);

  if (!user) {
    return res.status(404).json({ status: 'fail', message: '找不到此帳號' });
  }

  if (user.status !== 'disabled') {
    return res.json({ status: 'fail', message: '該帳號未被停權，無需恢復' });
  }

  user.status = 'active';

  res.json({
    status: 'success',
    message: `✅ 帳號 ${targetAccount} 已恢復使用權限`,
    user
  });
});


module.exports = router;
