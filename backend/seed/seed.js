// seed/seed.js
// 在終端機用以下指令執行資料初始化：
// node seed/seed.js
// 或者如果你在 package.json 裡加個 script：
// "scripts": {
//   "seed": "node seed/seed.js"
// }
// 就能直接這樣跑：
// npm run seed

const mongoose = require('mongoose');
const Shop = require('../models/home/Shop');

// 連線資料庫（用你自己的 URL）
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.once('open', async () => {
  console.log('MongoDB 已連線 ✅');

  // 插入測試資料，例如：
  const rawCategory = "'Open', 'OnlinePay'";

  const cleanedCategory = rawCategory
    .replace(/'/g, '')     // 移除單引號 → "Open, OnlinePay"
    .split(',')            // 切割 → ["Open", " OnlinePay"]
    .map(s => s.trim());   // 清理空白 → ["Open", "OnlinePay"]


  await Shop.create({
    name: '許昌源',
    phone: '0910513163',
    storeName: '麥味登延平店',
    storeAddress: '台北市士林區延平北路五段206號',
    merchantId: 'store2',
    category: cleanedCategory,
    storeImag: 'merchant02.jpg',
  });

  console.log('資料已插入 🎉');
  mongoose.connection.close();
});