const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);
const { Schema } = mongoose;

const merchantSchema = new Schema({
  _id: Number,
  member_ID: {//會員關聯ID
    type: Number, // 來自 members._id
    required: true
  },
  account: {//帳號
    type: String,
    required: true
  },
  password: {//密碼
    type: String,
    required: true
  },
  name: {//名字
    type: String,
    required: false
  },
  email: {//信箱
    type: String,
    required: true,
    match: [/^\S+@\S+\.\S+$/, 'Email 格式不正確']
  },
  phone: {//電話
    type: String
  },
  status: {//狀態
    type: String,
    default: 'pending',
    enum: ['active', 'disabled', 'pending']
  },
  created_at: {//註冊時間
    type: Date,
    default: Date.now
  },
  storeName: {//店家名稱
    type: String
  },
  storeAddress: {//店家地址
    type: String
  },
  merchant_ID: {//店家ID
    type: Number // 同 merchant 的 _id，可自動在建立後補上
  }
}, { collection: 'merchant' });

// 自動遞增 _id
merchantSchema.plugin(AutoIncrement, {id: 'merchant_counter',inc_field: '_id'});

// // merchant_ID 可等於 _id
// merchantSchema.pre('save', function (next) {
//   if (!this.merchant_ID) {
//     this.merchant_ID = this._id;
//   }
//   next();
// });

merchantSchema.post('save', async function (doc, next) {
  if (!doc.merchant_ID || doc.merchant_ID !== doc._id) {
    await doc.constructor.updateOne(
      { _id: doc._id },
      { $set: { merchant_ID: doc._id } }
    );
    }
  next();
});


module.exports = mongoose.model('Merchant', merchantSchema);
