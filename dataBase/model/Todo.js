const mongoose=require('mongoose');
const {Schema,model} = mongoose;

const todoShcema = new mongoose.Schema({
    _id:{
        type:Number,
        required: true
    },
    menu_item_id:{
        type:Number,
        default:function(){
      return this._id;
    }},
    name:String,
    description:String,
    price:Number,
    is_available:{ 
        type:Boolean,
        default:true},
    category_id:Number,
    menu_type_id:Number,
    promotion_id:{
        type:Number,
        required:false
    },
    menu_photo:String,
    location_id:Number    
},{collection:'menu_items'});

const Todo = mongoose.model('Todo',todoShcema);

module.exports = Todo;