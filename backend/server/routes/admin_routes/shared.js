// ✅ router/shared.js 共用 users、驗證碼、transporter

const nodemailer = require('nodemailer');
require('dotenv').config(); // 載入.env檔案

let verificationCodes = {};

const transporter = nodemailer.createTransport({
  service: 'gmail', // 使用Gmail伺服器（SMTP）寄信
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

module.exports = {  verificationCodes, transporter };
