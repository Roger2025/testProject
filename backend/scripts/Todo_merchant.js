const mongoose=require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose); 
const {Schema,model} = mongoose;

const todoShcema = new mongoose.Schema({
    _id:Number,
    merchant_ID:{//店家ID
        type:Schema.Types.ObjectId,
        default:function(){
      return this._id;
    }},
    storename:{//店家名稱
        type:String,
        required: true
    },
    address:{//地址
        type:String,
        required:true,
        unique:true
    },
    phone:{//電話
        type:String,
        required:true,
        unique:true
    },
    name:{//店長姓名
        type:String,
        required:true
    },
},{collection:'locations'});

todoShcema.plugin(AutoIncrement,{ id:'todo_counter',inc_field:'_id',start_seq: 1000});

module.exports = mongoose.model('Todo_merchant',todoShcema);;