/* --------------------[ 保留原檔內容（不執行）]--------------------
const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);
const merchantScheduleSchema = require('./merchantSchedule');
const { json } = require('express');
const { Schema } = mongoose;

const CATEGORY_KEYS = ['delivery','online_payment','pickup','cash_only'];
const TAG_KEYS = ['best_seller','popular_item','trending']; // 先放幾個預留，未來可擴充

const isBoolObjectWithKeys = (allowKeys) => (v) => {
  if (!v || typeof v !== 'object') return false;
  return Object.keys(v).every(k => allowKeys.includes(k)) &&
         Object.values(v).every(val => typeof val === 'boolean');
};

const merchantSchema = new Schema({
  member_id: {//會員關聯ID
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
  category: {
    type: Object,
    default: {},
    validate: { validator: isBoolObjectWithKeys(CATEGORY_KEYS), message: 'category 僅允許布林鍵：' + CATEGORY_KEYS.join(', ') }
  },
  Business: merchantScheduleSchema,
  tag: {
    type: Object,
    default: {},
    validate: { validator: isBoolObjectWithKeys(TAG_KEYS), message: 'tag 僅允許布林鍵：' + TAG_KEYS.join(', ') }
  },

}, { collection: 'merchant' });

module.exports = mongoose.model('Merchant', merchantSchema);
------------------------------------------------------------------ */

// 舊路徑統一轉用新的 Merchant 定義（真正的 schema 在 ../Register_Schema/merchant）
module.exports = require('../Register_Schema/merchant');
