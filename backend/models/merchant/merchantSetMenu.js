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
    trim: true,
    maxlength: [1000, '描述不能超過1000個字元'],
    default: ''
  },
  price: {
    type: Number,
    required: [true, '價格為必填'],
    min: [0, '價格不能為負數']
  },
  imagePath: {
    type: String,
    trim: true,
    default: null
  },
  available: {
    type: Boolean,
    default: true
  },
  merchantId: {
    type: String, // 暫時用 string，以配合 front-end bypass / default_merchant ；如果正式使用 ObjectId 再改回 mongoose.Schema.Types.ObjectId 並 validate
    required: [true, '商家ID為必填']
  },
  // 套餐包含的餐點項目
  items: [{
    menuId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'MerchantMenu',
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: [1, '數量至少為1'],
      default: 1
    },
    note: {
      type: String,
      maxlength: [200, '備註不能超過200個字元'],
      default: ''
    }
  }],
  // 套餐類別（對應前端 category: breakfast, brunch...）
  category: {
    type: String,
    enum: ['breakfast', 'brunch', 'value', 'premium', 'family'],
    default: 'breakfast'
  },
  tags: [{
    type: String,
    enum: ['熱銷', '新品', '限時', '推薦', '健康', '素食', '辣味', '清爽']
  }],
  validFrom: {
    type: Date,
    default: Date.now
  },
  validUntil: {
    type: Date,
    default: null
  },
  dailyLimit: {
    type: Number,
    min: [0, '限量不能為負數'],
    default: null
  },
  soldToday: {
    type: Number,
    default: 0,
    min: 0
  },
  lastResetDate: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// 索引
setMenuSchema.index({ merchantId: 1, available: 1 });
setMenuSchema.index({ merchantId: 1, category: 1 });
setMenuSchema.index({ validFrom: 1, validUntil: 1 });
setMenuSchema.index({ name: 'text', description: 'text' });

// 虛擬 - 格式化價格
setMenuSchema.virtual('formattedPrice').get(function() {
  return `NT$ ${this.price}`;
});

// 虛擬 - 是否在有效期內
setMenuSchema.virtual('isValid').get(function() {
  const now = new Date();
  const from = this.validFrom || new Date(0);
  const until = this.validUntil || new Date('2099-12-31');
  return now >= from && now <= until;
});

// 虛擬 - 是否有庫存
setMenuSchema.virtual('isInStock').get(function() {
  if (!this.dailyLimit) return true;
  return this.soldToday < this.dailyLimit;
});

// 虛擬 - 剩餘
setMenuSchema.virtual('remainingStock').get(function() {
  if (!this.dailyLimit) return null;
  return Math.max(0, this.dailyLimit - this.soldToday);
});

// 虛擬 - imageUrl（對外用，前端不必自己拼 /public/...）
setMenuSchema.virtual('imageUrl').get(function() {
  if (!this.imagePath) return null;
  // 保證用 /images/... 對應靜態目錄
  const normalized = this.imagePath.replace(/\\+/g, '/');
  return `/images/${normalized}`;
});

// 實例方法
setMenuSchema.methods.toggleAvailability = function() {
  this.available = !this.available;
  return this.save();
};

setMenuSchema.methods.addSale = function(quantity = 1) {
  this.soldToday += quantity;
  return this.save();
};

setMenuSchema.methods.resetDailySales = function() {
  this.soldToday = 0;
  this.lastResetDate = new Date();
  return this.save();
};

// 靜態查詢
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

setMenuSchema.statics.findByCategory = function(merchantId, category) {
  return this.find({ merchantId, category, available: true })
    .populate('items.menuId')
    .sort({ name: 1 });
};

// pre-save
setMenuSchema.pre('save', function(next) {
  if (this.price) {
    this.price = Math.round(this.price);
  }

  // reset daily sales if date changed
  const today = new Date().toDateString();
  const lastReset = this.lastResetDate?.toDateString?.() || '';
  if (today !== lastReset) {
    this.soldToday = 0;
    this.lastResetDate = new Date();
  }

  next();
});

// auto populate items.menuId
setMenuSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'items.menuId',
    select: 'name price imagePath available'
  });
  next();
});

module.exports = mongoose.model('SetMenu', setMenuSchema);