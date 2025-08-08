const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);
const merchantScheduleSchema = require('./merchantSchedule');
const { Schema } = mongoose;

const merchantSchema = new Schema({
  member_ID: {//會員關聯ID
    type: String, // 來自 members._id
    required: true
  },
  name: {//店長名字
    type: String,
    required: false
  },
  email: {//信箱
    type: String,
    required: false,
    match: [/^\S+@\S+\.\S+$/, 'Email 格式不正確']
  },
  phone: {//電話
    type: String
  },
  created_at: {//註冊時間
    type: Date
  },
  storeName: {//店家名稱
    type: String
  },
  storeAddress: {//店家地址
    type: String
  },
  merchantId: {//店家ID
    type: String // 同 merchant 的 _id，可自動在建立後補上
  },
  storeImag:{//店家照片
    type:String
  },
  category:String,//店家狀態
  Business: merchantScheduleSchema

}, { collection: 'merchant' });

module.exports = mongoose.model('Merchant', merchantSchema);
