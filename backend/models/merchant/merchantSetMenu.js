// models/merchant/merchantSetMenu.js
const mongoose = require('mongoose');

const setMenuSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, '套餐名稱為必填'],
    trim: true,
    maxlength: [100, '套餐名稱不能超過100個字元']
  },
  description: {
    type: String,
    required: [true, '套餐描述為必填'],
    trim: true,
    maxlength: [1000, '描述不能超過1000個字元']
  },
  price: {
    type: Number,
    required: [true, '價格為必填'],
    min: [0, '價格不能為負數']
  },
  imageUrl: {
    type: String,
    trim: true,
    validate: {
      validator: function(v) {
        if (!v) return true; // 允許空值
        return /^https?:\/\/.+/.test(v);
      },
      message: '請提供有效的圖片網址'
    }
  },
  available: {
    type: Boolean,
    default: true
  },
  merchantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Merchant',
    required: [true, '商家ID為必填']
  },
  // 套餐包含的餐點項目
  items: [{
    menuId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Menu',
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: [1, '數量至少為1'],
      default: 1
    },
    // 如果套餐中的餐點有特殊要求或備註
    note: {
      type: String,
      maxlength: [200, '備註不能超過200個字元']
    }
  }],
  // 套餐類型
  type: {
    type: String,
    enum: ['早餐套餐', '午餐套餐', '下午茶套餐', '特色套餐', '優惠套餐'],
    default: '早餐套餐'
  },
  // 套餐標籤
  tags: [{
    type: String,
    enum: ['熱銷', '新品', '限時', '推薦', '健康', '素食', '辣味', '清爽']
  }],
  // 套餐的有效期間
  validFrom: {
    type: Date,
    default: Date.now
  },
  validUntil: {
    type: Date,
    default: null // null 表示永久有效
  },
  // 每日限量
  dailyLimit: {
    type: Number,
    min: [0, '限量不能為負數'],
    default: null // null 表示無限量
  },
  // 今日已售出數量
  soldToday: {
    type: Number,
    default: 0,
    min: 0
  },
  // 最後重置銷售計數的日期
  lastResetDate: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// 索引設定
setMenuSchema.index({ merchantId: 1, available: 1 });
setMenuSchema.index({ merchantId: 1, type: 1 });
setMenuSchema.index({ validFrom: 1, validUntil: 1 });
setMenuSchema.index({ name: 'text', description: 'text' });

// 虛擬欄位 - 格式化價格
setMenuSchema.virtual('formattedPrice').get(function() {
  return `NT$ ${this.price}`;
});

// 虛擬欄位 - 檢查是否在有效期內
setMenuSchema.virtual('isValid').get(function() {
  const now = new Date();
  const validFrom = this.validFrom || new Date(0);
  const validUntil = this.validUntil || new Date('2099-12-31');
  return now >= validFrom && now <= validUntil;
});

// 虛擬欄位 - 檢查是否還有庫存
setMenuSchema.virtual('isInStock').get(function() {
  if (!this.dailyLimit) return true;
  return this.soldToday < this.dailyLimit;
});

// 虛擬欄位 - 剩餘數量
setMenuSchema.virtual('remainingStock').get(function() {
  if (!this.dailyLimit) return null;
  return Math.max(0, this.dailyLimit - this.soldToday);
});

// 實例方法 - 切換上架狀態
setMenuSchema.methods.toggleAvailability = function() {
  this.available = !this.available;
  return this.save();
};

// 實例方法 - 增加銷售數量
setMenuSchema.methods.addSale = function(quantity = 1) {
  this.soldToday += quantity;
  return this.save();
};

// 實例方法 - 重置每日銷售計數
setMenuSchema.methods.resetDailySales = function() {
  this.soldToday = 0;
  this.lastResetDate = new Date();
  return this.save();
};

// 靜態方法 - 依商家查詢可用套餐
setMenuSchema.statics.findAvailableByMerchant = function(merchantId) {
  const now = new Date();
  return this.find({
    merchantId,
    available: true,
    $or: [
      { validFrom: { $lte: now }, validUntil: null },
      { validFrom: { $lte: now }, validUntil: { $gte: now } }
    ]
  }).populate('items.menuId').sort({ createdAt: -1 });
};

// 靜態方法 - 依類型查詢
setMenuSchema.statics.findByType = function(merchantId, type) {
  return this.find({ merchantId, type, available: true })
             .populate('items.menuId')
             .sort({ name: 1 });
};

// 中間件 - 儲存前驗證和處理
setMenuSchema.pre('save', function(next) {
  // 確保價格為整數
  if (this.price) {
    this.price = Math.round(this.price);
  }
  
  // 檢查是否需要重置每日銷售計數
  const today = new Date().toDateString();
  const lastReset = this.lastResetDate.toDateString();
  
  if (today !== lastReset) {
    this.soldToday = 0;
    this.lastResetDate = new Date();
  }
  
  next();
});

// 中間件 - 查詢時自動填充餐點資料
setMenuSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'items.menuId',
    select: 'name price imageUrl isAvailable'
  });
  next();
});

module.exports = mongoose.model('SetMenu', setMenuSchema);