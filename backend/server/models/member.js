const mongoose = require('mongoose');
const { Schema } = mongoose;

const memberSchema = new Schema({
  account: { type: String, required: true }, 
  password: { type: String, required: true },
  name: { type: String },
  email: { type: String },
  phone: { type: String },
  created_at: { type: Date, default: Date.now },
  role: { type: String, default: 'user', enum: ['user', 'shop', 'admin'] }, 
  status: { type: String, default: 'active', enum: ['pending', 'active', 'disabled'] },
  storename: { type: String },
  address: { type: String },
  member_ID: { type: Number },
});

// 🔺明確指定 collection 名稱為 "members"
const Member = mongoose.model('Member', memberSchema, 'members');
module.exports = Member;