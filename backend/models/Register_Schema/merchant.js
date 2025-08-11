// 商家表 Schema和模型建立
const mongoose = require('mongoose');
const { Schema } = mongoose;
// 從 Register_Schema 走到 merchant 夾層的路徑
const merchantScheduleSchema = require('../merchant/merchantSchedule');

const merchantSchema = new Schema({
  member_id: {//會員關聯ID（改成非必填）
    type: String, // 來自 members._id
    required: false
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
  merchantId: {//店家ID（預設用本身 _id 的字串）
    type: String,
    default: function () { return String(this._id); }
  },
  storeImag:{ //店家照片
    type:String
  },
  category: { //店家狀態
     type: JSON 
    },
  Business: merchantScheduleSchema, // 營業排程
  tag: { 
    type: JSON 
  }
}, { collection: 'merchant' });

const Merchant =
  mongoose.models.Merchant || mongoose.model('Merchant', merchantSchema, 'merchant');

module.exports = Merchant;
