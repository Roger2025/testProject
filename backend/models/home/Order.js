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
}, { timestamps: true });

// 統一改成這一行（第三個參數 'order' 有需要時才保留）
module.exports = mongoose.models.Order || mongoose.model('Order', orderSchema, 'order');


// 訂餐內容: JSON 
// [
//   {
//     "id": 1,
//     "name": "豬肉漢堡",
//     "price": 50,
//     "quantity": 1,
//     "note": "不要生菜",
//     "img": "merchant1/burgers/burgers11.jpg"
//   },
//   {
//     "id": 2,
//     "name": "豬肉蛋餅",
//     "price": 45,
//     "quantity": 1,
//     "note": "不要生菜",
//     "img": "merchant1/omelettes/omelettes07.jpg"
//   },
//   {
//     "id": 3,
//     "name": "黑胡椒鐵板麵",
//     "price": 50,
//     "quantity": 1,
//     "note": "不要辣",
//     "img": "merchant1/pasta/pasta02.jpg"
//   },
//   {
//     "id": 4,
//     "name": "鮪魚漢堡",
//     "price": 50,
//     "quantity": 1,
//     "note": "醬多點",
//     "img": "merchant1/burgers/burgers06.jpg"
//   },
//   {
//     "id": 5,
//     "name": "豬排漢堡",
//     "price": 50,
//     "quantity": 1,
//     "note": "",
//     "img": "merchant1/burgers/burgers11.jpg"
//   },
//   {
//     "id": 7,
//     "name": "豆漿",
//     "price": 20,
//     "quantity": 1,
//     "note": "少冰、少糖",
//     "img": "merchant1/drinks/drinks04.jpg"
//   },
//   {
//     "id": 8,
//     "name": "薯餅",
//     "price": 20,
//     "quantity": 1,
//     "note": "",
//     "img": "merchant1/single/single02.jpg"
//   }
// ]