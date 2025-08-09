// backend/routes/home/homeOrder.js
// 建立路由
// 並在 backend/app.js 中加入
// const homeOrderRoutes = require('./routes/home/homeOrder');
// app.use('/api/orders', homeOrderRoutes);

const express = require('express');
const router = express.Router();
const homeOrderController = require('../../controllers/homeOrderController');

// GET /api/orders
router.get('/', homeOrderController.getAllOrders);

module.exports = router;