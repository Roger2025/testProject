require('dotenv').config();           // 放最上面
const express = require('express');
const cors = require('cors');
const session = require('express-session');
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo'); 

const { roleCheck } = require('./models/middlewares/roleCheck');
const adminRouter = require('./routes/admin_routes/admin');
const loginRouter = require('./routes/auth/login');
const registerRouter = require('./routes/auth/register');
const verifyRouter = require('./routes/auth/verify');
//const setAdminVerifiedRouter = require('./routes/admin_routes/setAdminVerified');

const app = express();

// 中介層設定
app.use(express.json());

app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true
}));

app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  rolling: true, // 每次請求都刷新時間
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_URI,   // 用你原本的 MongoDB 連線字串
    collectionName: 'sessions',          // 存在資料庫中的 collection 名稱
    ttl: 60 * 60                         // session 有效時間（秒）這裡是 1 小時
  }),
  cookie: {
    httpOnly: true,
    secure: false,
    maxAge: 1000 * 60 * 60               // cookie 保留時間（毫秒）同樣是 1 小時
  }
}));

app.use((req, res, next) => {
  req.user = req.session?.user || null;
  next();
});

// 掛載路由
app.use('/api/auth', loginRouter);
app.use('/api/auth', require('./routes/auth/me'));
app.use('/api/auth', require('./routes/auth/logout'));
app.use('/api/auth', registerRouter);
app.use('/api/auth', verifyRouter);

app.use('/api/admin', adminRouter);

app.use('/api', verifyRouter);
//app.use('/api/set-admin-verified', setAdminVerifiedRouter);

module.exports = app;