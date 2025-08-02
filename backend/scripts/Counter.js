const mongoose = require('mongoose');
const {Schema,model} = mongoose;



const counterSchema = new mongoose.Schema({
  _id: {
    type: String, // 對應每個資料表的名稱，例如 'user', 'order'
    required: true
  },
  seq: {
    type: Number, // 當前的自動遞增序號
    default: 0
  }
}, { collection: 'counters' });

const Counter = mongoose.model('Counter', counterSchema);
module.exports = Counter;