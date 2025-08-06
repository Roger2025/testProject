// 修正 category 錯誤格式的 script：fixCategoryFormat.js
// 在終端機用以下指令執行：
// node seed/fixCategoryFormat.js
// 或者如果你在 package.json 裡加個 script：
// "scripts": {
//   "fix-category": "node seed/fixCategoryFormat.js"
// }
// 就能直接這樣跑：
// npm run fix-category

const mongoose = require('mongoose');
const Shop = require('../models/home/Shop');

// 連線資料庫（請替換成你的 MongoDB URI）
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.once('open', async () => {
  console.log('✅ 已連線 MongoDB');

  // 找出 category 欄位為單一字串的資料
  const shops = await Shop.find({
    category: { $type: 'string' }, // 僅限錯誤格式
  });

  console.log(`🔍 找到 ${shops.length} 筆需要修正的資料`);

  for (const shop of shops) {
    // 拆分字串並轉為陣列
    const cleaned = shop.category
      .replace(/'/g, '')        // 去除單引號
      .split(',')               // 逗號分割
      .map(s => s.trim());      // 移除空白

    shop.category = cleaned;
    await shop.save();

    console.log(`✅ 修正完成：${shop.storeName}`);
  }

  console.log('🎉 所有資料已更新完畢！');
  mongoose.connection.close();
});