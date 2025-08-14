require('dotenv').config(); // Make sure this is at the very top
// app.js
const mongoose = require('mongoose');

const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const MongoStore = require('connect-mongo'); 
const session = require('express-session');

const app = express();

// CORS 設定
app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000', 'http://localhost:3001'],
  credentials: true,
  methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'cache-control']
}));

// 商家路由
var indexRouter = require('./routes/index');  	//test
var usersRouter = require('./routes/users');	//test
const merchantMenuRouter = require('./routes/merchant/merchantMenu');
const merchantSetMenuRouter = require('./routes/merchant/merchantSetMenu');
const merchantScheduleRouter = require('./routes/merchant/merchantSchedule');
const merchantOrderRoutes = require('./routes/merchant/merchantOrder');
const merchantProfileRouter = require('./routes/merchant/merchantProfile');


// Admin & Auth 路由
const { roleCheck } = require('./models/middlewares/roleCheck');
const adminRouter = require('./routes/admin_routes/admin');
const loginRouter = require('./routes/auth/login');
const registerRouter = require('./routes/auth/register');
const verifyRouter = require('./routes/auth/verify');
const storeMenuRouter = require('./routes/storeMenuRoute');
const orderRoutes = require('./routes/orderRoute');
const historyOrdersRoute = require("./routes/historyOrdersRoute");
// const setAdminVerifiedRouter = require('./routes/admin_routes/setAdminVerified');

// User Home 路由
const homeShopRoutes = require('./routes/home/homeShop'); 
const homeOrderRoutes = require('./routes/home/homeOrder'); // for 訂單測試，可以拿掉。
const homeSubscribeRoutes = require('./routes/home/subscribe');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// 中間件
mongoose.connect(process.env.MONGO_URI  , {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})



app.use(session({
  secret: 'your-secret-key',//密碼
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


app.use(express.json({ limit: '10mb' })); // 增加請求大小限制，支援圖片上傳
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
  req.user = req.session?.user || null;
  next();
});


// 商家路由 
app.use('/', indexRouter);       //用不到
app.use('/users', usersRouter);  //用不到
app.use('/api/merchant', merchantMenuRouter);
app.use('/api/merchant', merchantSetMenuRouter);
app.use('/api/merchant/schedule', merchantScheduleRouter);
app.use('/api/merchant/orders', merchantOrderRoutes);
app.use('/api/merchant/', merchantProfileRouter);

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
app.use("/user/shop/order", historyOrdersRoute);   // ← 單數，跟菜單頁一致 // "/user/shop/order"
app.use('/api/order', orderRoutes);
app.use('/api/user/shop', storeMenuRouter);  // 0813 change to '/api/user/shop'
// app.use('/', indexRouter);
// Admin 路由
app.use('/api/admin', adminRouter);

// User Home 路由
app.use('/api/home/shop', homeShopRoutes);
app.use('/api/home/order', homeOrderRoutes); // for 訂單測試，可以拿掉。
app.use('/api/home/sub', homeSubscribeRoutes);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

module.exports = app;