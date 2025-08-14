const express = require('express');
const router = express.Router();
const MenuItem = require("../models/user/userMenu");

// GET /api/menu/:merchantId
// 根據 merchantId 取得菜單
router.get('/:merchantId', async (req, res) => {
  try {
    const merchantId = req.params.merchantId;
    console.log("收到的 merchantId:", merchantId);
    const items = await MenuItem.find({ merchantId }).select(
      `merchantId  name price category available notes imagePath -_id`).lean();

    //  merchantId options name price category available notes imagePath  <=增加內容再加入
    if (!items || items.length === 0) {
      return res.status(404).json({ error: "找不到該餐廳菜單" });
    }

    res.json(items);
  } catch (err) {
    console.error("餐點查詢錯誤：", err);
    res.status(500).send("無法取得餐點資料");
  }
});

module.exports = router;
