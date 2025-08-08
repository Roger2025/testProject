// backend/models/merchant/Order.js
const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  note: {
    type: String,
    default: ''
  }
}, { _id: false });

const orderSchema = new mongoose.Schema({
  order_id: {
    type: String,
    required: true,
    unique: true
  },
  member_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Member'
  },
  merchant_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Merchant'
  },
  member_name: {
    type: String,
    required: true
  },
  storename: {
    type: String,
    required: true
  },
  content: [orderItemSchema],
  total_amount: {
    type: Number,
    required: true,
    min: 0
  },
  order_status: {
    type: String,
    enum: ['PENDING', 'CONFIRMED', 'PREPARING', 'READY', 'COMPLETED', 'CANCELLED'],
    default: 'PENDING'
  },
  order_date: {
    type: Date,
    default: Date.now
  },
  updated_at: {
    type: Date,
    default: Date.now
  },
  // 額外欄位
  pickup_time: {
    type: Date
  },
  special_instructions: {
    type: String
  },
  payment_method: {
    type: String,
    enum: ['CASH', 'CREDIT_CARD', 'LINE_PAY', 'APPLE_PAY'],
    default: 'CASH'
  },
  payment_status: {
    type: String,
    enum: ['PENDING', 'PAID', 'FAILED', 'REFUNDED'],
    default: 'PENDING'
  }
}, {
  timestamps: false, // 使用自定義的 order_date 和 updated_at
  collection: 'orders' // 明確指定集合名稱
});

// 索引設置
orderSchema.index({ merchant_id: 1, order_date: -1 });
orderSchema.index({ order_id: 1 });
orderSchema.index({ member_id: 1 });
orderSchema.index({ order_status: 1 });
orderSchema.index({ 
  merchant_id: 1, 
  order_date: -1, 
  order_status: 1 
});

// 中間件：更新時自動設置 updated_at
orderSchema.pre('save', function(next) {
  if (this.isModified() && !this.isNew) {
    this.updated_at = new Date();
  }
  next();
});

orderSchema.pre('findOneAndUpdate', function(next) {
  this.set({ updated_at: new Date() });
  next();
});

// 靜態方法：取得今日訂單
orderSchema.statics.getTodayOrders = function(merchantId) {
  const today = new Date();
  const startOfDay = new Date(today.setHours(0, 0, 0, 0));
  const endOfDay = new Date(today.setHours(23, 59, 59, 999));
  
  return this.find({
    merchant_id: merchantId,
    order_date: {
      $gte: startOfDay,
      $lte: endOfDay
    }
  }).sort({ order_date: 1 }); // 由舊到新排序
};

// 靜態方法：取得今日統計
orderSchema.statics.getTodayStats = function(merchantId) {
  const today = new Date();
  const startOfDay = new Date(today.setHours(0, 0, 0, 0));
  const endOfDay = new Date(today.setHours(23, 59, 59, 999));
  
  return this.aggregate([
    {
      $match: {
        merchant_id: new mongoose.Types.ObjectId(merchantId),
        order_date: {
          $gte: startOfDay,
          $lte: endOfDay
        },
        order_status: { $ne: 'CANCELLED' }
      }
    },
    {
      $group: {
        _id: null,
        totalOrders: { $sum: 1 },
        totalAmount: { $sum: '$total_amount' }
      }
    }
  ]);
};

// 實例方法：計算訂單項目總數量
orderSchema.methods.getTotalQuantity = function() {
  return this.content.reduce((total, item) => total + item.quantity, 0);
};

// 虛擬欄位：格式化訂單日期
orderSchema.virtual('formattedOrderDate').get(function() {
  return this.order_date.toLocaleString('zh-TW');
});

// 設置 JSON 輸出時包含虛擬欄位
orderSchema.set('toJSON', { virtuals: true });

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;