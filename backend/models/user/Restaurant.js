const mongoose = require("mongoose");
// 定義餐廳模型
const restaurantSchema = new mongoose.Schema({
  merchantId: String,       // "store1"
  storeName: String,     // 餐廳名稱
  storeAddress: String,  // 地址
  storePhone: String,    // 電話號碼 
  storeImag: String,    // 圖片 URL
});

module.exports = mongoose.model("Restaurant", restaurantSchema , 'merchant');
