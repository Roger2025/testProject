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

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// 中間件
app.use(logger('dev'));
// app.use(express.json());
app.use(express.json({ limit: '10mb' })); // 增加請求大小限制，支援圖片上傳
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
// app.use('/images', express.static('public/images'));
// app.use(cors());

// CORS 設定 - 允許前端 React 開發服務器連線
app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
  credentials: true
  // methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], 
  // allowedHeaders: ['Content-Type', 'Authorization']  
}));

// 路由設定
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/api/shops', homeShopRoutes);

// 測試路由
const testRoutes = require('./routes/test');
app.use('/api', testRoutes);

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