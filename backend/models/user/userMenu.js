const mongoose = require("mongoose");
// 定義菜單項目
const menuItemSchema = new mongoose.Schema({
  merchantId: String,            
  name: String,
  price: Number,
  category: String,
  available: Boolean,
  notes: String,
  imagePath: String
});

module.exports = mongoose.model("MenuItem", menuItemSchema, "merchantmenus");
