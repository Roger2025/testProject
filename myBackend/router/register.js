// router/register.js 註冊新用戶
const express = require('express');
const router = express.Router();
const { users } = require('./shared');

router.post('/register', (req, res) => {
  const { account, password, email, role, storeName, storeAddress } = req.body;
  const existingUser = users.find(u => u.account === account);

  // ✅ 檢查帳號是否存在
  if (existingUser) {
    return res.json({ status: 'fail', message: '帳號已存在' });
  }

  // ✅ 密碼格式驗證（至少 6 碼，含英文與數字）
  const isValidPassword = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{6,20}$/;
  if (!isValidPassword.test(password)) {
    return res.json({ status: 'fail', message: '❌ 密碼需含英文與數字，長度 6～20 字元' });
  }

  // ✅ 若通過檢查，寫入使用者
  users.push({
    account,
    password,
    // 🔽 新增：若註冊者選擇商家，預設 role 為 'pending'，其餘仍為 'user'
    role: role === 'shop' ? 'pending' : 'user',
    name: account,          // 預設名字與帳號相同
    email,
    storeName: role === 'shop' ? storeName : '',        // ✅ 新增欄位
    storeAddress: role === 'shop' ? storeAddress : '',   // ✅ 新增欄位
    status: 'active'
  });

  console.log('✅ 新使用者註冊:', account, email);

  res.json({ status: 'success', message: '✅ 註冊成功！請返回登入頁面' });
});

module.exports = router;
