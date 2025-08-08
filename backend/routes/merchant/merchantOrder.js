// backend/routes/merchant/merchantOrder.js
const express = require('express');
const router = express.Router();
const merchantOrderController = require('../../controllers/merchantOrderController');

// 取得「今日訂單」（根據 merchantId）
router.get('/today/:merchantId', merchantOrderController.getTodayOrders);

// 取得「今日訂單統計」
router.get('/stats/:merchantId', merchantOrderController.getOrderStats);

// 取得「指定日期範圍」的訂單 (?startDate=xxx&endDate=xxx)
router.get('/range/:merchantId', merchantOrderController.getOrdersByDateRange);

// 取得「指定狀態」的訂單
router.get('/status/:status/:merchantId', merchantOrderController.getOrdersByStatus);

// 取得「單一訂單詳情」
router.get('/:orderId', merchantOrderController.getOrderById);

// 更新「單一訂單狀態」
router.patch('/:orderId/status', merchantOrderController.updateOrderStatus);

// 批次更新「多筆訂單狀態」
router.patch('/batch/update-status', merchantOrderController.batchUpdateOrderStatus);

module.exports = router;