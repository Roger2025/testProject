const mongoose = require('mongoose');
// 定義訂單的寫入內容
const orderSchema = new mongoose.Schema({
  order_id: { type: String, required: true },
  member_name: { type: String, default: 'Test' },
  storename: { type: String, required: true },
  content: { type: Array, required: true },
  total_amount: { type: Number, required: true },
  order_status: {type: String, default:'Uncompleted'},
  merchantId: {type: String, default:''},
  order_date :{type:Date,default: () => {const now = new Date();
    now.setHours(now.getHours() + 8); // 台灣時區 = UTC+8
    return now;}},
  pickupMethod: { type: String, default: 'eating' }, // 預設為內用
  member_id : { type: String, required: true }
});

// 統一改成這一行（第三個參數 'order' 有需要時才保留）
module.exports = mongoose.models.Order || mongoose.model('Order', orderSchema, 'order');

