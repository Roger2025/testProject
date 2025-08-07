// backend/controllers/homeOrderController.js
// 控制器 - 把資料從 DB 傳出去

const Order = require('../models/home/Order');

// 取得所有訂單
exports.getAllOrders = async (req, res) => {
  try {
    // const orders = await Order.find().sort({ order_date: -1 }); // 最新的在前
    const orders = await Order.find().limit(50);
    console.log('Fetched orders:', orders);
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: '無法取得訂單資料' });
  }
};