// backend/controllers/homeOrderController.js
// 控制器 - 把資料從 DB 傳出去

const Order = require('../models/home/Order');

// 在後端先處理圖片副檔名不正確就採用預設圖片
const path = require('path');
const fs = require('fs');

const validExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp'];
const imageDir = path.join(__dirname, '../public/images');
const defaultImage = 'ByteEat.png'; // 預設圖片

function resolveImagePath(imagePath) {
  if (!imagePath) return defaultImage;
  const hasValidExt = validExtensions.some(ext => imagePath.toLowerCase().endsWith(ext));
  const fullPath = path.join(imageDir, imagePath);
  // 如果副檔名正確且檔案存在
  if (hasValidExt && fs.existsSync(fullPath)) {
    return imagePath;
  }
  // 嘗試補上 .jpg 並檢查是否存在
  const fallbackPath = `${imagePath}.jpg`;
  const fallbackFullPath = path.join(imageDir, fallbackPath);
  if (fs.existsSync(fallbackFullPath)) {
    return fallbackPath;
  }
  // 都不行就用預設圖片
  return defaultImage;
}

// 取得所有訂單
exports.getAllOrders = async (req, res) => {
  try {
    // const orders = await Order.find().sort({ order_date: -1 }); // 最新的在前
    // const orders = await Order.find().limit(50);
    // console.log('Fetched orders:', orders);
    // res.json(orders);

    const orders = await Order.find().lean(); // 用 lean() 讓資料是 plain object

    const formattedOrders = orders.map(order => {
      const fixedContent = order.content.map(item => ({
        ...item,
        img: resolveImagePath(item.img),
      }));

      return {
        ...order,
        content: fixedContent,
      };
    });
    console.log('Fetched formatted orders:', formattedOrders);
    res.json(formattedOrders);
  } catch (err) {
    res.status(500).json({ error: '無法取得訂單資料' });
  }
};