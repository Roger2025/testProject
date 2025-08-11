require('dotenv').config(); // Make sure this is at the very top
//dotenv管理環境變數用

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

// MongoDB 連線
const mongoose = require('mongoose');

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

// CORS 設定 - 允許前端 React 開發服務器連線
app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/api/home/shop', homeShopRoutes);
app.use('/api/home/order', homeOrderRoutes);

app.use('/api/merchant', merchantMenuRouter);
app.use('/api/merchant', merchantSetMenuRouter);
app.use('/api/merchant/schedule', merchantScheduleRouter);
app.use('/api/merchant/orders', merchantOrderRoutes);

const homeSubscribeRoutes = require('./routes/home/subscribe');
app.use('/api/home/sub', homeSubscribeRoutes);

// 測試路由
const testRoutes = require('./routes/test');
app.use('/api', testRoutes);

// Debug 路由
app.use('/api/debug', require('./routes/debug'));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;