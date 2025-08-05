const mongoose = require('mongoose');
const { Schema } = mongoose;

const memberSchema = new Schema({

  // 基本欄位
  account: { type: String, required: true, unique: true }, // 確保帳號必填且唯一
  password: { type: String, required: true, unique: true },
  name: { type: String },
  email: { type: String, unique: true },
  phone: { type: String },
  created_at: { type: Date }, 
  role: { type: String, default: 'user', enum: ['user', 'shop', 'admin'] }, // enum=限制值
  status: { type: String, default: 'active', enum: ['pending', 'active', 'disabled'] },
  nickName: { type: String }, // 消費者暱稱

  // 商家相關欄位（
  storeName: { type: String },             
  storeAddress: { type: String },          
  merchantId: { type: String }, // 商家ID

});

// 明確指定collection 名稱為"members"
const Member = mongoose.model('Member', memberSchema, 'members');
module.exports = Member;
