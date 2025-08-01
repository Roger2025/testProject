const express = require('express');
const router = express.Router();
const { verificationCodes, transporter } = require('./shared'); // ✅ 保留共用
const Member = require('../../models/member');

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
router.post('/login', async (req, res) => { // ✅ 改為 async function
  const { account, password  } = req.body;

  let dbUser;
   try {
    console.log('收到前端帳號:', account);
    dbUser = await Member.findOne({ account }); // 正確：查 MongoDB 的 user 欄位
    console.log('資料查詢結果:', dbUser);
  } catch (err) {
    console.error('❌ 查詢帳號失敗:', err);
    return res.status(500).json({ status: 'error', message: '伺服器錯誤' });
  }

  //const test = await Member.find();
  //console.log('全部帳號:', test);
  if (!dbUser) {
    console.log('收到前端帳號:', account);
    console.log('資料庫查詢結果:', dbUser);
    return res.json({ status: 'fail', message: '查無此帳號' });
  }

  if (dbUser.password !== password) {
    return res.json({ status: 'fail', message: '密碼錯誤' });
  }

  // ✅ 新增：如果帳號是被停權的，禁止登入
  if (dbUser.status === 'Suspended') {
    return res.status(403).json({
      status: 'forbidden',
      message: '❌ 此帳號已被停權，無法登入'
    });
  }

  if (dbUser.status === 'pending') {
    return res.status(403).json({
      status: 'forbidden',
      message: '❌ 帳號尚未通過審核，請等待管理者啟用',
    });
  }

  // ✅ 設定 session
  req.session.user = {
    id: dbUser._id,
    role: dbUser.role,
    name: dbUser.name,
    email: dbUser.email
  };

  console.log('✅ 登入成功並寫入 session', req.session.user);

  // ✅ 如果是 admin 寄送驗證碼
  if (dbUser.role === 'admin') {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    verificationCodes[dbUser.email] = {
      code,
      expiresAt: Date.now() + 5 * 60 * 1000 // 控制驗證碼有效時間 5分鐘
    };
    transporter.sendMail({
      from: 'A127038349@gmail.com',
      to: dbUser.email,
      subject: '管理者登入驗證碼',
      text: `您的驗證碼是：${code}`
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

    res.clearCookie('connect.sid');
    res.json({ status: 'success', message: '✅ 已成功登出' });
  });
});

module.exports = router;
