// backend/routes/home/homeShop.js
// 建立路由 for 消費者
// 並在 backend/app.js 中加入
// const homeShopRoutes = require('./routes/home/homeShop');
// app.use('/api/home/shop', homeShopRoutes);

const express = require('express');
const router = express.Router();
const { getAllShops, getShopById } = require('../../controllers/homeShopController');

// GET 查詢所有店家資料 /api/home/shop === root '/' 
router.get('/', getAllShops);
// 對應網址 http://localhost:3001/api/home/shop/ 驗證 OK

// GET 查詢單一店家資料 /api/home/shop/:merchantId
router.get('/:merchantId', getShopById);
// 對應網址 http://localhost:3001/api/home/shop/:merchantId 
// 例如: http://localhost:3001/api/home/shop/store1 驗證 OK

module.exports = router;