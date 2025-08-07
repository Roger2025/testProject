const mongoose = require('mongoose');
const {Schema,model} = mongoose;
const AutoIncrement = require('mongoose-sequence')(mongoose);

const todoShcema = new mongoose.Schema({
    member_id:String,//會員關聯ID
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
    },
    nickName:{//暱稱
      type:String,
      default:function(){
        return this.name
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
        default: () => {
          const now = new Date();
          now.setHours(now.getHours() + 8); // 台灣時區 = UTC+8
          return now;
          }},
    role:{//身分(消費者/商家/管理者)
        type:String,
        default:'user',
        enum:['user','shop','admin']
    },
    status:{//狀態(正常(預設)/停權/待確認)
        type:String,
        enum:['active','disabled','pending']
    },
    storeName:{//店家名稱
        type:String,
        required: function () {
            return this.role === 'shop';
    }},     
    storeAddress:{//店家地址
        type:String,
        required: function () {
            return this.role === 'shop';       
    }}, 
    merchantId:{//店家ID
        type:String,
        required:false
    },
    storeImag:{//店家照片
        type:String,
        required: function () {
            return this.role === 'shop';
    }}
},{collection:'members'});

//當role='shop'  status預設為待審核 否則預設為正常
todoShcema.pre('save', function (next) {
  // 🎯 依 role 設定 status
  if (!this.status) {
    this.status = this.role === 'shop' ? 'pending' : 'active';
  }
  next();
});

module.exports = mongoose.model('Todo_User',todoShcema);