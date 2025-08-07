const mongoose=require('mongoose');
const {Schema,model} = mongoose;
const AutoIncrement = require('mongoose-sequence')(mongoose);

const todoShcema = new mongoose.Schema({
    order_id:String,//訂單編號
    member_id:String,//會員ID
    merchantId:{//店家ID
        type:String,
        required:true,
        unique: true
    },
    member_name:{//關聯消費者name(members會員表)
        type:String,
        required:true
    },
    storename:{//關聯店家name(locations店家表)
        type:String,
        required:true
    },
    content:{//訂單內容
        type:JSON,
        required:true
    },
    remark:{//備註
        type:String,
        required:false
    },        
   total_amount:{//訂單總金額
        type:Number    
   },
   order_status:{//訂單狀況(完成/未完成(預設)/棄單)
        type:String,
        default:'Uncompleted',
        enum:['Completed','Uncompleted','Abandoned']
   },
   order_date:{//下單時間
     type:Date,
    default:Date.now
    },
    pickupMethod:{//取餐方式(內用(預設)/自取)
        type:String,
        default:'eatin',
        enum:['eatin','piclup']
    }

},{collection:'order'});

module.exports = mongoose.model('Todo_order',todoShcema);