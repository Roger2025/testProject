// backend/routes/home/subscribe.js

const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.json({ message: "Subscribe router is active" });
});

// api/home/subscribe
router.post("/", async (req, res) => {
  try {
    console.log("收到訂閱請求:", req.body);

    const { email } = req.body;
    const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    if (!email || !isValidEmail) {
      return res.status(400).json({ message: "無效的信箱格式" });
    }

    // const existing = await db.collection("subscribers").findOne({ email });
    // if (existing) {
    //   return res.status(409).json({ message: "此信箱已訂閱過" });
    // }

    // await db.collection("subscribers").insertOne({
    //   email,
    //   subscribedAt: new Date(),
    // });

    // await transporter.sendMail({
    //   from: '"Byte Eat" <no-reply@byteeat.com>',
    //   to: email,
    //   subject: "歡迎訂閱 Byte Eat！",
    //   html: `<p>感謝您的訂閱，我們會定期寄送最新優惠給您。</p>`,
    // });

    // 模擬成功邏輯
    res.json({ message: "訂閱成功！感謝您的支持" });
  } catch (err) {
    console.error("訂閱錯誤：", err);
    res.status(500).json({ message: "伺服器錯誤，請稍後再試" });
  }
});

module.exports = router;