const Member = require('../../server/models/member');
const bcrypt = require('bcryptjs');
const { verificationCodes, transporter } = require('../shared/shared');
require('dotenv').config(); // 載入 .env 檔案 (管理者專屬資料)

async function handleLogin(req, res) { 

  // 清空舊 session，避免殘留前一個帳號資料
  req.session.user = null;

  const { account, password  } = req.body;

  let dbUser;
   try {
    console.log('收到前端帳號:', account);
    console.log('正在登入中...');
    dbUser = await Member.findOne({ account }); // 正確：查 MongoDB 的 account 欄位
  } catch (err) {
    console.error(' 查詢帳號失敗:', err);
    return res.status(500).json({ status: 'error', message: '伺服器錯誤' });
  }

  //const test = await Member.find();
  //console.log('全部帳號:', test);

  // 檢查帳號密碼
  if (!dbUser) {
    return res.json({ status: 'fail', message: '查無此帳號' });
  }
  
  // 使用 bcrypt 比較密碼
  const isMatch = await bcrypt.compare(password, dbUser.password); 
  if (!isMatch) {
    return res.json({ status: 'fail', message: '密碼錯誤' });
  }

  // 如果帳號是被停權的，禁止登入
  if (dbUser.status === 'disabled') {
    return res.status(403).json({ // 鏈式寫法
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
  console.log('✅ 登入成功!');
//   console.log('✅ dbUser 內容：', dbUser);

  //  設定 session
  req.session.user = {
    //sessionId: req.sessionID,
    //merchantid: dbUser?.merchantid || 'unknown',
    account: dbUser.account,
    role: dbUser.role,
    name: dbUser.name,
    email: dbUser.email,
    status: dbUser.status,
    adminVerified: dbUser.role === 'admin' ? false : undefined,
    nickName: dbUser?.nickName || 'unknown',
    merchantId: dbUser?.merchantId || 'unknown',
  };

  console.log('✅ 登入成功並寫入 session', req.session.user);

  //  如果是 admin 寄送驗證碼
  if (dbUser.role === 'admin') {
    const code = Math.floor(100000 + Math.random() * 900000).toString(); // 100000確保6碼
    verificationCodes[dbUser.email] = {
      code,
      expiresAt: Date.now() + 5 * 60 * 1000 // 控制驗證碼有效時間 5分鐘
    };
    try {
      const info = await transporter.sendMail({
        from: process.env.EMAIL_USER, // 實際發信人 跟 transporter 的 user 一致！
        to: dbUser.email,             // 收件人 
        subject: '管理者登入驗證碼',
        text: `您的驗證碼是：${code}`
      });
      console.log('✅ 郵件發送成功:', info.response);
    } catch (err) {
      console.error('❌ 郵件發送失敗:', err); // 顯示終端機錯誤
    }
  }

  //  統一回傳 session.user 給前端
  res.json({
    status: 'success',
    user: {
    account: dbUser.account,
    role: dbUser.role,
    nickName: dbUser.nickName,
    email: dbUser.email,
  },
    message: '登入成功'
  });
}

module.exports = { handleLogin };