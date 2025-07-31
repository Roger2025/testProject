const express = require('express');
const router = express.Router();
const { users, verificationCodes, transporter } = require('./shared');

// ✅ 檢查登入狀態
router.get('/me', (req, res) => {
  console.log('👉 檢查 session：', req.session.user);
  if (req.session.user) {
    res.json({ status: 'ok', user: req.session.user });
  } else {
    res.status(401).json({ status: 'unauthorized', message: '未登入' }); //鏈式方法寫法
  }
});

// ✅ 登入邏輯
router.post('/login', (req, res) => {
  const { account, password } = req.body;
  const user = users.find(u => u.account === account); //目前user是假資料 到時要改成資料庫

  if (!user) {
    return res.json({ status: 'fail', message: '查無此帳號' });
  }

  if (user.password !== password) {
    return res.json({ status: 'fail', message: '密碼錯誤' });
  }

  // ✅ 新增：如果帳號是被停權的，禁止登入
  if (user.status === 'disabled') {
    return res.status(403).json({
      status: 'forbidden',
      message: '❌ 此帳號已被停權，無法登入'
    });
  }

  if (user.role === 'pending') {
    return res.status(403).json({
      status: 'forbidden',
      message: '❌ 帳號尚未通過審核，請等待管理者啟用',
    });
  }

  // ✅ 設定 session
  req.session.user = {
    id: user.id || user.account,
    role: user.role,
    name: user.name,
    email: user.email
  };

  // ✅ 如果是 admin 寄送驗證碼
  if (user.role === 'admin') {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    verificationCodes[user.email] = code;

    transporter.sendMail({
      from: 'A127038349@gmail.com', // 寄件者的 Email（看你要寫誰都行，但某些服務可能會驗證）
      to: user.email, // 收件者的 Email（這裡是登入者的 email）
      subject: '管理者登入驗證碼', // 信件標題
      text: `您的驗證碼是：${code}` // 信件內容（純文字格式）
    }, (err, info) => {
      if (err) console.error('❌ 郵件發送失敗:', err);
      else console.log('✅ 郵件發送成功:', info.response);
    });
  }

  // ✅ 統一回傳 session.user 給前端
  res.json({
    status: 'success',
    user: req.session.user,
    message: '登入成功'
  });
});

// ✅ ✨登出 API：銷毀 session 並清除 cookie
router.post('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      console.error('❌ 登出失敗:', err);
      return res.status(500).json({ status: 'error', message: '登出失敗' });
    }

    res.clearCookie('connect.sid'); // 清除 cookie（名稱要對）
    res.json({ status: 'success', message: '✅ 已成功登出' });
  });
});

module.exports = router;
