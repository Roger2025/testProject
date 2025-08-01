// server/server.js
const app = require('./app'); // ✅ 正確引用 app.js
const mongoose = require('mongoose'); // ✅ 引入 mongoose
require('dotenv').config(); // ✅ 載入 .env

// ✅ 資料庫連線（搬來這裡更清楚）
mongoose.connect(process.env.MONGO_URI).then(() => {
  console.log('✅ 成功連線 MongoDB');
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`🚀 伺服器啟動於 http://localhost:${PORT}`);
  });
}).catch(err => {
  console.error('❌ 資料庫連線失敗:', err);
});
