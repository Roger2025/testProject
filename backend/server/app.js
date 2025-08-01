// server/app.js
require('dotenv').config();           // ✅ 放最上面
const express = require('express');
const cors = require('cors');
const session = require('express-session');
const mongoose = require('mongoose');

const { roleCheck } = require('./middlewares/roleCheck');
const adminRouter = require('./routes/admin_routes/admin');
const loginRouter = require('./routes/admin_routes/login');
const registerRouter = require('./routes/admin_routes/register');
const verifyRouter = require('./routes/admin_routes/verify');

const app = express();

// ✅ 中介層設定
app.use(express.json());

app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true
}));


app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: false,
    maxAge: 1000 * 60 * 60
  }
}));

app.use((req, res, next) => {
  req.user = req.session?.user || null;
  next();
});

// ✅ 掛載路由
app.use('/api/admin', adminRouter);
app.use('/api', loginRouter);
app.use('/api', registerRouter);
app.use('/api', verifyRouter);

module.exports = app;
