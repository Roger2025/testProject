// backend/routes/test.js
const express = require('express');
const router = express.Router();

// 測試用 API /api/test
router.get('/test', (req, res) => {
  res.json({ message: '前後端 API 連線成功！' });
});

// GET /api/test/shop/:merchantId
router.get('/test/shop/:merchantId', (req, res) => {
  const merchantId = req.params.merchantId;
  console.log('✅ 後端收到 merchantId:', merchantId);

  // 模擬資料回傳 // 不過，該早餐點的 MongoDB 資料庫為 merchantmenus 
  res.json({
    message: `模擬資料回傳 成功接收 merchantId: ${merchantId}`,
    merchantId,
    products: [
      { name: '火腿蛋吐司', price: 45 },
      { name: '奶茶', price: 30 },
    ],
  });
});

// GET /api/test/order/:order_id
router.get('/test/order/:order_id', (req, res) => {
  const order_id = req.params.order_id;
  console.log('模擬資料回傳 後端收到 order_id:', order_id);

  // 模擬資料回傳  
  res.json({
    message: `成功接收 order_id: ${order_id}`,
    order_id,
    products: [{
      order_id: '5bd8e91d-af64-49ee-a451-981bc6c890ad',
      member_name: '小明',
      storename: '幸福早餐店',
      content: [
        { name: '紅茶', price: 45, quantity: 1, note: '5555' },
        { name: '奶茶', price: 55, quantity: 1, note: '3333' },
        { name: '豆漿', price: 50, quantity: 3, note: '' }
      ],
      total_amount: 45 + 55 + 50 * 3, // 前端可計算或後端自動
      order_status: 'Uncompleted',
      order_date: new Date(),
      member_id: '6890a03f958d4f3d12bef867',
      merchantId: 'store1',
      pickupMethod: '自取'
    }],
  });
});

module.exports = router;