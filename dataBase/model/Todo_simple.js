const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);
const { Schema } = mongoose;

const simpleSchema = new mongoose.Schema({
  _id: Number,
  order_ID: Number,
  member_ID: Number,
  total_price: Number,
  date: {
    type: Date,
    default: Date.now
  }
}, { collection: 'order_simple' });

simpleSchema.plugin(AutoIncrement, {id: 'order_simple_counter',inc_field: '_id'});

module.exports = mongoose.model('Todo_simple', simpleSchema);
