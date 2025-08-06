// backend/controllers/homeShopController.js
// 控制器 - 把資料從 DB 傳出去

const Shop = require('../models/home/Shop');

exports.getAllShops = async (req, res) => {	
  try {
	const shops = await Shop.find().limit(50);
    console.log('Fetched shops:', shops);
    res.json(shops);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};