// backend/routes/home/homeOrder.js
// 建立路由 for 消費者
// 並在 backend/app.js 中加入
// const homeOrderRoutes = require('./routes/home/homeOrder');
// app.use('/api/home/order', homeOrderRoutes);

const express = require('express');
const router = express.Router();
const homeOrderController = require('../../controllers/homeOrderController');

// GET 查詢所有訂單 /api/home/order === root '/'
router.get('/', homeOrderController.getAllOrders);

// GET 查詢單筆訂單 /api/home/order/:order_id
router.get('/:order_id', homeOrderController.getOrderById);

// POST 建立新訂單 /api/home/order
// router.post('/', homeOrderController.createOrder);

// POST再訂一次 /api/home/order/:order_id/reorder 
router.post('/:order_id/reorder', homeOrderController.createOrder);

// PATCH 取消訂單 /api/home/order/:order_id/cancel
router.patch('/:order_id/cancel', homeOrderController.cancelOrder);


// 店家
// PATCH 更新已訂單 /api/merchant/order
// router.patch('/:order_id', homeOrderController.updateOrderStatus);

// 店家
// DELETE 刪除訂單 /api/merchant/order/:order_id/delete
// router.delete('/:order_id', homeOrderController.deleteOrder);

module.exports = router;