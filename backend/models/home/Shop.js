// backend/models/home/Shop.js
// MongoDB 的 Table = merchant 
// Columns 有 storeName, storeAddress, merchantId, storeAddress,...
// MongoDB 資料結構設計（對應 React 前端格式）

const mongoose = require('mongoose');

// 子結構：訂餐內容（對應前端的 店家 store）
const storeSchema = new mongoose.Schema({
  // storeId: {
  //   type: String,
  //   required: true,
  // },
  // storeName: {
  //   type: String,
  //   required: true,
  //   trim: true,
  // },
  // storeImage: {
  //   type: String,
  //   default: '',
  // },
  schedule: {
    monday: {
      isOpen: { type: Boolean, default: false },
      openTime: { type: String, default: '06:00' },
      closeTime: { type: String, default: '14:00' },
    },
    tuesday: {
      isOpen: { type: Boolean, default: false },
      openTime: { type: String, default: '06:00' },
      closeTime: { type: String, default: '14:00' },
    },
    wednesday: {
      isOpen: { type: Boolean, default: false },
      openTime: { type: String, default: '06:00' },
      closeTime: { type: String, default: '14:00' },
    },
    thursday: {
      isOpen: { type: Boolean, default: false },
      openTime: { type: String, default: '06:00' },
      closeTime: { type: String, default: '14:00' },
    },
    friday: {
      isOpen: { type: Boolean, default: true },
      openTime: { type: String, default: '05:00' },
      closeTime: { type: String, default: '20:00' },
    },
    saturday: {
      isOpen: { type: Boolean, default: false },
      openTime: { type: String, default: '06:00' },
      closeTime: { type: String, default: '14:00' },
    },
    sunday: {
      isOpen: { type: Boolean, default: false },
      openTime: { type: String, default: '06:00' },
      closeTime: { type: String, default: '14:00' },
    },
  },
  timezone: {
    type: String,
    default: 'Asia/Taipei',
  },
  // _id: {
  //   type: String,
  //   required: true,
  // },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  lastModified: {
    type: Date,
    default: Date.now,
  },
}, { _id: false }); // 不自動產生 _id，避免冗餘

const shopSchema = new mongoose.Schema({
  storeName: String,	// 早餐店名稱 = '味佳奇早餐'
  storeImag: String,	// 早餐店 Logo 存放路徑 = 'merchant1/merchant01.jpg'
  merchantId: String,	// 早餐店ID = 'store4'	  
  // url: String,			// url = merchantId, 例如 url: '/store4'
  // category: [String],	// 早餐店狀態，例如 ['Open', 'OnlinePay'] Open 營業中, OnlinePay 可線上支付 
  category: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  storeAddress: String,	// 早餐店地址 = '台北市士林區社中街344號'
  Business: [storeSchema], // 店家提供營業時間 JSON 檔
});

module.exports = mongoose.model('Shop', shopSchema, 'merchant');