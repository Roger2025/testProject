// controllers/auth/verifyController.js
const { verificationCodes, transporter } = require('../shared/shared');

// 驗證信箱用的控制器函式
const handleVerify = (req, res) => {
  const { email, code } = req.body;
  const record = verificationCodes[email];
  console.log('收到驗證 email:', email);
  console.log('目前所有驗證碼：', verificationCodes); 
  if (!record) {
    return res.json({
      status: 'fail',
      message: '❌ 尚未發送驗證碼或驗證碼已失效，請重新登入。'
    });
  }

  if (Date.now() > record.expiresAt) {
    delete verificationCodes[email];
    return res.json({
      status: 'fail',
      message: '❌ 驗證碼已過期，請重新登入以獲得新的驗證碼。'
    });
  }

  if (record.code !== code) {
    return res.json({
      status: 'fail',
      message: '❌ 驗證碼錯誤，請重新輸入。'
    });
  }

  //  驗證成功：記錄到 session
  req.session.user.adminVerified = true;
  console.log('✅ 驗證後的 session 狀態:', req.session);

  delete verificationCodes[email];
  res.json({ status: 'success', message: '✅ 驗證成功！' });
};

module.exports = { handleVerify };