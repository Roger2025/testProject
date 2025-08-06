// backend/routes/test.js
const express = require('express');
const router = express.Router();

// 測試用 API
router.get('/test', (req, res) => {
  res.json({ message: '前後端 API 連線成功！' });
});

// GET /api/:merchantId
router.get('/shop/:merchantId', (req, res) => {
  const merchantId = req.params.merchantId;
  console.log('✅ 後端收到 merchantId:', merchantId);

  // 模擬資料回傳 // 不過，該早餐點的 MongoDB 資料庫為 merchantmenus 
  res.json({
    message: `成功接收 merchantId: ${merchantId}`,
    merchantId,
    products: [
      { name: '火腿蛋吐司', price: 45 },
      { name: '奶茶', price: 30 },
    ],
  });
});

module.exports = router;