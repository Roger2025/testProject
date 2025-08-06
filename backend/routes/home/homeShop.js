// backend/routes/home/homeShop.js
// 建立路由
// 並在 backend/app.js 中加入
// const homeShopRoutes = require('./routes/home/homeShop');
// app.use('/api/shops', homeShopRoutes);

const express = require('express');
const router = express.Router();
const { getAllShops } = require('../../controllers/homeShopController');

router.get('/', getAllShops);

module.exports = router;