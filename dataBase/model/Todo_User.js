const mongoose = require('mongoose');
const {Schema,model} = mongoose;
const AutoIncrement = require('mongoose-sequence')(mongoose);

const todoShcema = new mongoose.Schema({
    _id:Number,
    member_id:{//會員關聯ID
        type:Number,
        required:false,
        default:function(){
      return this._id
    }},
    account:{//帳號
        type:String,
        required:true,
        unique: true
    },
    password:{//密碼
        type:String,
        required:true
    },
    name:{//名字
        type:String,
        required:false,
        default:function(){
      return this.account   
    }},    
    email:{//信箱
        type:String,
        required:true,
        unique: true,
        match:[/^\S+@\S+\.\S+$/,'Email 格式不正確']
    },
    phone:{//電話
        type:String,
        required:false
    },
    created_at:{//註冊時間
        type:Date,
        default:Date.now
    },
    role:{//身分(消費者/商家/管理者)
        type:String,
        default:'user',
        enum:['user','shop','admin']
    },
    status:{//狀態(正常(預設)/停權/待確認)
        type:String,
        enum:['active','disabled','pending']
    },
    storename:{//店家名稱
        type:String,
        required: function () {
            return this.role === 'shop';
    }},     
    address:{//店家地址
        type:String,
        required: function () {
            return this.role === 'shop';       
    }}, 
    merchant_ID:{//店家ID
        type:String,
        required:false
    }
},{collection:'members'});

todoShcema.plugin(AutoIncrement, { id:'member_counter', inc_field: '_id'});

//member_id同步_id
todoShcema.post('save', async function (doc, next) {
  if (!doc.member_id || doc.member_id !== doc._id) {
    await doc.constructor.updateOne(
      { _id: doc._id },
      { $set: { member_id: doc._id } }
    );
    }
  next();
});

//當role='shop'  status預設為待審核 否則預設為正常
todoShcema.pre('save', function (next) {
  // 🎯 依 role 設定 status
  if (!this.status) {
    this.status = this.role === 'shop' ? 'pending' : 'active';
  }
  next();
});

module.exports = mongoose.model('Todo_User',todoShcema);