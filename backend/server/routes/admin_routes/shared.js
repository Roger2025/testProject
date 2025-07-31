// ✅ router/shared.js 共用 users、驗證碼、transporter

const nodemailer = require('nodemailer');

let users = [
  { account: 'admin', password: '1234', role: 'admin', name: '管理者', email: 'A127038349@gmail.com' },
  { account: 'shop', password: '123', role: 'shop', name: '商家', email: 'shop@example.com' },
  { account: 'user', password: '5678', role: 'user', name: '消費者', email: 'user@example.com' },
    {
    account: 'r',
    password: '1111',
    role: 'pending',
    name: 'shop001',
    email: 'shop001@example.com',
    storeName: '幸福早餐店',
    storeAddress: '台北市中山區南京東路一段1號'
  },
  {
    account: 'ro',
    password: '1111',
    role: 'pending',
    name: 'shop002',
    email: 'shop002@example.com',
    storeName: '活力便當',
    storeAddress: '新北市板橋區文化路二段88號'
  },
  {
    account: 'rog',
    password: '1111',
    role: 'pending',
    name: 'shop003',
    email: 'shop003@example.com',
    storeName: '午餐吃這家',
    storeAddress: '台中市西屯區市政北一路123號'
  },
  {
    account: 'roge',
    password: '1111',
    role: 'pending',
    name: 'shop004',
    email: 'shop004@example.com',
    storeName: '宵夜炸物舖',
    storeAddress: '高雄市三民區建國路55號'
  },
  {
    account: 'roger',
    password: '1111',
    role: 'pending',
    name: 'shop005',
    email: 'shop005@example.com',
    storeName: '素食愛好者',
    storeAddress: '新竹市東區食品路66號'
  }
];

let verificationCodes = {};

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'A127038349@gmail.com',
    pass: 'xnvpegeyztqsgvoe'
  }
});

module.exports = { users, verificationCodes, transporter };
