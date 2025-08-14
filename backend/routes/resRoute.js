const express = require('express');
const router = express.Router();
const Restaurant = require("../models/user/Restaurant");

// GET /api/restaurant/:merchantId
// 根據 merchantId 查詢餐廳資訊
router.get('/:merchantId', async (req, res) => {
  try {
    const merchantId = req.params.merchantId;
    console.log("查詢餐廳 merchantId:", merchantId);

    const restaurant = await Restaurant.findOne({ id: merchantId }).select(
      `storeName storeAddress storePhone storeImag -_id`).lean();

    if (!restaurant) {
      return res.status(404).json({ error: "找不到對應的餐廳" });
    }

    const result = {
      storeName: restaurant.name,
      storeAddress: restaurant.address,
      storePhone: restaurant.phone,
      storeImag: restaurant.image
    };

    res.json(result);
  } catch (err) {
    console.error("餐廳查詢錯誤：", err);
    res.status(500).send("無法取得餐廳資料");
  }
});
