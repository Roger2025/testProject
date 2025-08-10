// models/merchant/merchantMenu.js
const mongoose = require('mongoose');

// 選項子架構
const OptionSchema = new mongoose.Schema({
  value: {
    type: String,
    required: true
  },
  label: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    default: 0
  }
}, { _id: false });

// 主要菜單項目架構
const MerchantMenuSchema = new mongoose.Schema({
  // 商家ID
  merchantId: {
    type: String,
    required: true,
    index: true
  },
  
  // 餐點名稱
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  
  // 餐點描述
  description: {
    type: String,
    trim: true,
    maxlength: 500,
    default: ''
  },
  
  // 價格
  price: {
    type: Number,
    required: true,
    min: 0
  },
  
  // 餐點類別
  category: {
    type: String,
    required: true,
    enum: ['burger', 'egg-pancake', 'toast', 'noodles', 'single', 'drink','set-meal'], 
    default: 'burger'
  },
  
  // 是否供應中
  available: {
    type: Boolean,
    default: true
  },
  
  // 備註
  notes: {
    type: String,
    trim: true,
    maxlength: 300,
    default: ''
  },
  
  // 餐點選項 (主要用於飲料類)
  options: {
    // 尺寸選項
    size: {
      type: [OptionSchema],
      default: []
    },
    // 溫度選項
    temperature: {
      type: [OptionSchema],
      default: []
    }
  },
  
  // 圖片路徑
  imagePath: {
    type: String,
    default: null
  },
  
  // 排序順序
  sortOrder: {
    type: Number,
    default: 0
  },
  
  // 是否為推薦餐點
  isRecommended: {
    type: Boolean,
    default: false
  },
  
  // 準備時間 (分鐘)
  preparationTime: {
    type: Number,
    min: 0,
    default: 10
  },
  
  // 營養資訊 (可選)
  nutrition: {
    calories: {
      type: Number,
      min: 0
    },
    protein: {
      type: Number,
      min: 0
    },
    carbs: {
      type: Number,
      min: 0
    },
    fat: {
      type: Number,
      min: 0
    }
  },
  
  // 過敏原資訊
  allergens: [{
    type: String,
    enum: ['gluten', 'dairy', 'eggs', 'nuts', 'soy', 'seafood', 'sesame']
  }],
  
  // 飲食標籤
  dietaryTags: [{
    type: String,
    enum: ['vegetarian', 'vegan', 'glutenFree', 'dairyFree', 'lowSodium', 'lowSugar']
  }],
  
  // 軟刪除標記
  isDeleted: {
    type: Boolean,
    default: false
  },
  
  // 刪除時間
  deletedAt: {
    type: Date,
    default: null
  },
  
  // 創建時間
  createdAt: {
    type: Date,
    default: Date.now
  },
  
  // 更新時間
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  // 自動添加 createdAt 和 updatedAt
  timestamps: true,
  // 轉換為 JSON 時的選項
  toJSON: {
    transform: function(doc, ret) {
      // 移除內部字段
      delete ret.__v;
      delete ret.isDeleted;
      delete ret.deletedAt;
      return ret;
    }
  },
  // 轉換為 Object 時的選項
  toObject: {
    transform: function(doc, ret) {
      delete ret.__v;
      delete ret.isDeleted;
      delete ret.deletedAt;
      return ret;
    }
  }
});

// 索引設置
MerchantMenuSchema.index({ merchantId: 1, category: 1 });
MerchantMenuSchema.index({ merchantId: 1, available: 1 });
MerchantMenuSchema.index({ merchantId: 1, isDeleted: 1 });
MerchantMenuSchema.index({ merchantId: 1, sortOrder: 1 });
MerchantMenuSchema.index({ createdAt: -1 });

// 虛擬字段 - 完整圖片 URL
MerchantMenuSchema.virtual('imageUrl').get(function() {
  if (this.imagePath) {
    return `/public/${this.imagePath}`;
  }
  return null;
});

// 中間件 - 保存前更新 updatedAt
MerchantMenuSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// 中間件 - 更新前設置 updatedAt
MerchantMenuSchema.pre(['findOneAndUpdate', 'updateOne', 'updateMany'], function(next) {
  this.set({ updatedAt: new Date() });
  next();
});

// 靜態方法 - 獲取商家的可用餐點
MerchantMenuSchema.statics.getAvailableItems = function(merchantId) {
  return this.find({
    merchantId: merchantId,
    available: true,
    isDeleted: { $ne: true }
  }).sort({ sortOrder: 1, createdAt: -1 });
};

// 靜態方法 - 根據類別獲取餐點
MerchantMenuSchema.statics.getItemsByCategory = function(merchantId, category) {
  return this.find({
    merchantId: merchantId,
    category: category,
    isDeleted: { $ne: true }
  }).sort({ sortOrder: 1, createdAt: -1 });
};

// 實例方法 - 軟刪除
MerchantMenuSchema.methods.softDelete = function() {
  this.isDeleted = true;
  this.deletedAt = new Date();
  return this.save();
};

// 實例方法 - 恢復
MerchantMenuSchema.methods.restore = function() {
  this.isDeleted = false;
  this.deletedAt = null;
  return this.save();
};

// 實例方法 - 切換可用狀態
MerchantMenuSchema.methods.toggleAvailability = function() {
  this.available = !this.available;
  return this.save();
};

// 實例方法 - 獲取選項的價格調整
MerchantMenuSchema.methods.getOptionPrice = function(optionType, optionValue) {
  if (!this.options || !this.options[optionType]) {
    return 0;
  }
  
  const option = this.options[optionType].find(opt => opt.value === optionValue);
  return option ? option.price : 0;
};

// 實例方法 - 計算包含選項的總價格
MerchantMenuSchema.methods.calculateTotalPrice = function(selectedOptions = {}) {
  let totalPrice = this.price;
  
  Object.keys(selectedOptions).forEach(optionType => {
    if (this.options && this.options[optionType]) {
      const selectedValue = selectedOptions[optionType];
      const option = this.options[optionType].find(opt => opt.value === selectedValue);
      if (option) {
        totalPrice += option.price;
      }
    }
  });
  
  return totalPrice;
};

// 查詢助手 - 排除已刪除的項目
MerchantMenuSchema.query.notDeleted = function() {
  return this.where({ isDeleted: { $ne: true } });
};

// 查詢助手 - 只獲取可用的項目
MerchantMenuSchema.query.available = function() {
  return this.where({ available: true });
};

const MerchantMenu = mongoose.model('MerchantMenu', MerchantMenuSchema);

module.exports = MerchantMenu;