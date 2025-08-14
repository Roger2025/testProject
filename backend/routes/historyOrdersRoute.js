const express = require("express");
const router = express.Router();
// 改用正確的 model
const historyOrder = require("../models/user/historyOrdersModel");

// GET /api/orders/history/:memberId
router.get("/history/:memberId", async (req, res) => {
  try {
    const { memberId } = req.params;

    // 沒 timestamps 就用 _id 當建立時間排序（新 → 舊）
    const docs = await historyOrder.find({ member_id: memberId }).sort({ _id: -1 }).lean();

    // 後端將 DB 的欄位統一轉成前端已經在用的格式
    const orders = docs.map((d) => {
      const items = Array.isArray(d.content) ? d.content : [];
      const total = items.reduce(
        (sum, it) => sum + (Number(it.price) || 0) * (Number(it.quantity) || 0),
        0
      );
      const createdAt =
        d.createdAt ||
        (d._id && typeof d._id.getTimestamp === "function" ? d._id.getTimestamp() : undefined);

      return {
        _id: d._id,
        order_id: d.order_id,
        storename: d.storename,
        orderItems: items,     // ← 前端 HistoryOrdersPage 目前讀這個
        totalPrice: total,     // ← 前端讀這個
        orderType: d.orderType || "—",
        createdAt,             // ← 供頁面顯示時間
      };
    });

    res.json(orders);
  } catch (err) {
    console.error("取得歷史訂單錯誤:", err);
    res.status(500).json({ message: "伺服器錯誤" });
  }
});

module.exports = router;
