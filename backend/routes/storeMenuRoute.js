const express = require('express');
const router = express.Router();
const MenuItem = require("../models/user/userMenu");
const Restaurant = require("../models/user/Restaurant");

// GET /order/menu/:merchantId
// 根據 merchantId 取得餐廳資訊和菜單
router.get('/:merchantId', async (req, res) => {
  try {
    const merchantId = req.params.merchantId;
    console.log("merchantId : " , merchantId);
    // 查餐廳資料
    const restaurant = await Restaurant.findOne({ merchantId }).lean();
    if (!restaurant) {
      return res.status(404).json({ error: "找不到餐廳資料" });
    }

    // 查菜單資料
    const menuItems = await MenuItem.find({ merchantId }).select(
      'merchantId name price category available notes  imagePath -_id'
    ).lean();

    // 回傳格式
    const response = {
      storeInfo: {
        storeName: restaurant.storeName,
        storeAddress: restaurant.storeAddress,
        storePhone: restaurant.storePhone,
        storeImag: restaurant.storeImag
      },
      menu: menuItems
    };

    res.json(response);
  } catch (err) {
    console.error("❌ 資料查詢錯誤：", err);
    res.status(500).send("無法取得資料");
  }
});

module.exports = router;
