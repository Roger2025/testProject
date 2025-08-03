const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);
const { Schema } = mongoose;

const consumerSchema = new Schema({
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
    default: 'active',
    enum: ['active', 'disabled', 'pending']
  },
  created_at: {//註冊時間
    type: Date,
    default: Date.now
  }

}, { collection: 'consumer' });

consumerSchema.plugin(AutoIncrement, {id: 'consumer_counter',inc_field: '_id'});

module.exports = mongoose.model('Consumer', consumerSchema);;
