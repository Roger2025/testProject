require('dotenv').config(); // Make sure this is at the very top
//dotenv管理環境變數用

const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const session = require('express-session');
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo');

// 商家路由
// const indexRouter = require('./routes/index'); 用不到
//const usersRouter = require('./routes/users'); 用不到
const merchantMenuRouter = require('./routes/merchant/merchantMenu');
const merchantSetMenuRouter = require('./routes/merchant/merchantSetMenu');
const merchantScheduleRouter = require('./routes/merchant/merchantSchedule');
const merchantOrderRoutes = require('./routes/merchant/merchantOrder');

// Admin & Auth 路由
const { roleCheck } = require('./models/middlewares/roleCheck');
const adminRouter = require('./routes/admin_routes/admin');
const loginRouter = require('./routes/auth/login');
const registerRouter = require('./routes/auth/register');
const verifyRouter = require('./routes/auth/verify');
// const setAdminVerifiedRouter = require('./routes/admin_routes/setAdminVerified');

const app = express();

// 路由變數定義
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const homeShopRoutes = require('./routes/home/homeShop');
const homeOrderRoutes = require('./routes/home/homeOrder');

var merchantMenuRouter = require('./routes/merchant/merchantMenu');
var merchantSetMenuRouter = require('./routes/merchant/merchantSetMenu');
var merchantScheduleRouter = require('./routes/merchant/merchantSchedule');
var merchantOrderRoutes = require('./routes/merchant/merchantOrder');
const cors = require('cors');

var app = express();

// MongoDB 連線設定 // Refer to Wayne
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log(' 成功連接到 App MongoDB');
  console.log(`MongoDB Connected: ${mongoose.connection.host}`);
})
.catch((err) => {
  console.error(' 連接失敗:', err.message);
});

// MongoDB 連線設定
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('MongoDB 連線成功');
    // 顯示連線資訊
    console.log('[DB]', mongoose.connection.host, mongoose.connection.port, mongoose.connection.name);
  })
  .catch((error) => {
    console.error('MongoDB 連線失敗:', error);
  });

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// 中間件
app.use(logger('dev'));
app.use(express.json({ limit: '10mb' })); // 增加請求大小限制，支援圖片上傳
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// CORS 設定
app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000', 'http://localhost:3001'],
  credentials: true,
  methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Session 設定
app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  rolling: true,
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_URI,
    collectionName: 'sessions',
    ttl: 60 * 60
  }),
  cookie: {
    httpOnly: true,
    secure: false,
    maxAge: 1000 * 60 * 60
  }
}));

// 注入使用者資訊到 req
app.use((req, res, next) => {
  req.user = req.session?.user || null;
  next();
});

// 商家路由 
//app.use('/', indexRouter);       用不到
//app.use('/users', usersRouter);  用不到
app.use('/api/merchant', merchantMenuRouter);
app.use('/api/merchant', merchantSetMenuRouter);
app.use('/api/merchant/schedule', merchantScheduleRouter);
app.use('/api/merchant/orders', merchantOrderRoutes);

const homeSubscribeRoutes = require('./routes/home/subscribe');
app.use('/api/home/sub', homeSubscribeRoutes);

// 測試與 Debug 路由
//const testRoutes = require('./routes/test');
//app.use('/api', testRoutes);
//app.use('/api/debug', require('./routes/debug'));

// Auth 路由
app.use('/api/auth', loginRouter);
app.use('/api/auth', require('./routes/auth/me'));
app.use('/api/auth', require('./routes/auth/logout'));
app.use('/api/auth', registerRouter);
app.use('/api/auth', verifyRouter);

// Admin 路由
app.use('/api/admin', adminRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

module.exports = app;
