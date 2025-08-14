const express = require('express');
const router = express.Router();
const Order = require('../models/user/Order');

//從前端接收 UUID
router.post('/create', async (req, res) => {
  try {
    const {
      order_id,
      member_name = "",
      storename,
      content,
      total_amount,
      merchantId,
      pickupMethod = "eating", // 預設為內用
      member_id
    } = req.body;

    if (!storename || !order_id || !content || !total_amount || !member_id) {
      return res.status(400).json({ error: '缺少必要欄位' });
    }
    // 檢查 content 是否為陣列且至少有一個項目
    const newOrder = new Order({
      order_id,
      member_name,
      storename,
      content,
      total_amount,
      merchantId,
      pickupMethod,
      member_id
    });

    await newOrder.save();

    res.status(201).json({ message: '訂單儲存成功', order_id });
  } catch (error) {
    console.error(' 新增訂單失敗:', error);
    res.status(500).json({ error: '無法新增訂單' });
  } 
});

module.exports = router;
