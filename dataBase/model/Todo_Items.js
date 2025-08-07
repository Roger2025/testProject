const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);
const { Schema } = mongoose;

const itemsSchema = new mongoose.Schema({
  _id:Number,
  order_ID: Number,
  menu_item_id: Number,
  quantity: Number,
  price: Number,
  subtotal: Number
}, { collection: 'order_items' });

itemsSchema.plugin(AutoIncrement, {id: 'order_ltems_counter',inc_field: '_id'});

module.exports = mongoose.model('Todo_Items', itemsSchema);
