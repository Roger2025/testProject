// 商家表 Schema和模型建立
const mongoose = require('mongoose');
const { Schema } = mongoose;

const merchantSchema = new Schema({
  merchantId: { type: String },
  storeName: { type: String,  },
  storeAddress: { type: String },
  storePhone: { type: String },
  email: { type: String },
  created_at: { type: Date },
  phone: { type: String },
  name: { type: String },
  
});

Merchant = mongoose.model('Merchant', merchantSchema, 'merchant');
module.exports = Merchant
