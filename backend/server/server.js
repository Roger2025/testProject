const app = require('./app'); // 
const mongoose = require('mongoose'); // 
require('dotenv').config(); // 

// 資料庫連線 確保連線成功才啟動伺服器
mongoose.connect(process.env.MONGO_URI).then(() => {
  console.log('✅ 成功連線 MongoDB');
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`🚀 伺服器啟動於 http://localhost:${PORT}`);
  });
}).catch(err => {
  console.error('❌ 資料庫連線失敗:', err);
});
