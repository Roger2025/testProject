// backend/controllers/homeShopController.js
// 控制器 - 把資料從 DB 傳出去

const Shop = require('../models/home/Shop');
const { resolveImagePath } = require('../utils/imageHelper');

// GET 查詢所有店家資料 /api/home/shop === root '/' 
exports.getAllShops = async (req, res) => {	
  try {
	const shops = await Shop.find().limit(50);
    // console.log('Fetched shops:', shops);
    // res.json(shops);  

  // const formatted = shops.map(shop => ({
  //   storeName: shop.storeName,
  //   storeImag: resolveImagePath(shop.storeImag),
  //   merchantId: shop.merchantId,
  //   category: shop.category,
  //   storeAddress: shop.storeAddress,
  //   Business: shop.Business,
  // }));

    const formatted = shops.map(shop => ({
      ...shop.toObject(), // ✅ 保留所有欄位
      storeImag: resolveImagePath(shop.storeImag), // ✅ 格式化圖片路徑
    }));

    console.log('Fetched formatted shops:', formatted);
    res.json(formatted);
  } catch (err) {
    console.error('[getAllShops] DB 錯誤:', err);
    // res.status(500).json({ message: '無法取得所有店家資料' });
    res.status(500).json({ error: err.message });
  }
};

// GET 查詢單一店家資料 /api/home/shop/:merchantId
exports.getShopById = async (req, res) => {
  try {
    const shop = await Shop.findOne({ merchantId: req.params.merchantId }).lean();
    if (!shop) return res.status(404).json({ message: '店家不存在' });

  // const formatted = {
  //   storeName: shop.storeName,
  //   storeImag: resolveImagePath(shop.storeImag),
  //   merchantId: shop.merchantId,
  //   category: shop.category,
  //   storeAddress: shop.storeAddress,
  //   Business: shop.Business,
  // };

    const formatted = {
      ...shop, // ✅ 保留所有欄位, lean() 已是 plain object
      storeImag: resolveImagePath(shop.storeImag), // ✅ 格式化圖片路徑
    };

    console.log('Fetched formatted shops:', formatted);
    res.json(formatted);
  } catch (err) {
    console.error('[getShopById] DB 錯誤:', err);
    // res.status(500).json({ message: '伺服器錯誤' });
    res.status(500).json({ error: err.message });
  }
};