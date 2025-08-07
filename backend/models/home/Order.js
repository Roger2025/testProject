// backend/models/home/Order.js
// Node.js 後端 + MongoDB 資料庫
// MongoDB 的 Table = order
// MongoDB 資料結構設計（對應 React 前端格式）

const mongoose = require('mongoose');

// 子結構：訂餐內容（對應前端的 menu items）
const itemSchema = new mongoose.Schema({
  name: { type: String, required: true },      // 品項名稱，例如：紅茶
  price: { type: Number, required: true },     // 單價，例如：45
  quantity: { type: Number, required: true },  // 數量，例如：1
  note: { type: String },                      // 備註，例如："少冰"
  img: { type: String },                       // 餐點圖片路徑，例如：
}, { _id: false }); // 不自動產生 _id，避免冗餘

// 主結構：訂單資料
const orderSchema = new mongoose.Schema({
  order_id: { type: String, required: true, index: true }, // 訂單編號（UUID）5bd8e91d-af64-49ee-a451-981bc6c890ad
  member_name: { type: String, required: true },           // 會員名稱（前端顯示用）
  storename: { type: String, required: true },             // 早餐店名稱
  // content: { type: mongoose.Schema.Types.Mixed }, 	   // 訂餐內容 (JSON) 
  content: [itemSchema],                                   // 訂餐內容（陣列）
  total_amount: { type: Number, required: true },          // 總金額（前端計算或後端自動）
  order_status: {
    type: String,
    enum: ['Uncompleted', 'Accepted', 'Completed', 'Closed', 'Cancelled'],          // 訂單狀態 Uncompleted (未完成=已下單), Accepted (已接單), Completed (已完成), Closed (已結單), Cancelled (已取消)
    default: 'Uncompleted'
  },
  order_date: { type: Date, required: true },              // 下單時間（ISO 格式）2025-08-03 15:33:13
  member_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Member' }, // 會員 ID（關聯用）ObjectId("6890a03f958d4f3d12bef867")
  merchantId: { type: String, required: true, index: true },          // 店家 ID（例如 store1）662f41ac1234567890abcde1
  pickupMethod: {
    type: String,
    enum: ['Takeout', 'eatin'],                          // 取餐方式 Takeout (自取), Dine-In (內用)
    default: 'eatin'
  }
});

module.exports = mongoose.model('Order', orderSchema, 'order');

// 訂餐內容: JSON 
// [
//   {
//     "name": "紅茶",
//     "price": 45,
//     "quantity": 1,
//     "note": "5555"
//   },
//   {
//     "name": "奶茶",
//     "price": 55,
//     "quantity": 1,
//     "note": "3333"
//   },
//   {
//     "name": "豆漿",
//     "price": 50,
//     "quantity": 3,
//     "note": ""
//   }
// ]