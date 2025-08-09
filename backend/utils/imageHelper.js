// backend/utils/imageHelper.js
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
  if (hasValidExt && fs.existsSync(fullPath)) return imagePath;
  // 嘗試補上 .jpg 並檢查是否存在
  const fallbackPath = `${imagePath}.jpg`;
  const fallbackFullPath = path.join(imageDir, fallbackPath);
  if (fs.existsSync(fallbackFullPath)) return fallbackPath;
  // 都不行就用預設圖片
  return defaultImage;
}

module.exports = { resolveImagePath };