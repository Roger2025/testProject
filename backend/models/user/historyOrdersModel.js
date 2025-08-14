const mongoose = require("mongoose");

const ItemSchema = new mongoose.Schema(
  { name: String, price: Number, quantity: Number, note: { type: String, default: "" } },
  { _id: false }
);

const OrderSchema = new mongoose.Schema(
  {
    member_id: { type: String, required: true, index: true },
    order_id: { type: String, required: true },
    storename: { type: String, default: "" },
    content: { type: [ItemSchema], default: [] }, // 你的 DB 欄位
  },
  { collection: "order", timestamps: false } // 你的集合名是 'order'
);

module.exports = mongoose.model("historyOrder", OrderSchema,"order");
