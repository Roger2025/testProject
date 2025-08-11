const express = require('express');
const cors = require('cors');
const session = require('express-session');  //  記得安裝 npm install express-session
const { roleCheck } = require('./middlewares/roleCheck'); //  加入角色權限中介層
const debugRouter = require('./router/debug'); // ⬅️ 加上這行


const adminRouter = require('./router/admin');
const loginRouter = require('./router/login');
const registerRouter = require('./router/register');
const verifyRouter = require('./router/verify');

const app = express();

app.use(express.json());

app.use(cors({
  origin: ['http://localhost:3000','http://localhost:3001'], // 允許的前端來源
  credentials: true                // 允許瀏覽器把 cookie（或 session ID）一併傳到後端
}));

//  設定 session
app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: false,           //  若部署到 https，改成 true
    maxAge: 1000 * 60 * 60   // 1 小時
  }
}));


//  將登入資訊存進 req.user（統一管理用戶狀態）
app.use((req, res, next) => {
  req.user = req.session?.user || null; //?.可選鏈結運算子 如果物件存在就取得屬性
  next();
});

//  掛載路由
app.use('/api/debug', debugRouter); // ⬅️ 加在 app.use 區域 // 掛載 debug 測試路由
app.use('/api/admin', adminRouter);
app.use('/api', loginRouter);
app.use('/api', registerRouter);
app.use('/api', verifyRouter);

//  啟動伺服器
app.listen(5000, () => {
  console.log('✅ 後端運行於 http://localhost:5000');
});
