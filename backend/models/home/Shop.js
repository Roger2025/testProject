// backend/models/home/Shop.js
// MongoDB 的 Table = merchant 
// Columns 有 storeName, storeAddress, merchantId, storeAddress,...
// MongoDB 資料結構設計（對應 React 前端格式）

const mongoose = require('mongoose');

const shopSchema = new mongoose.Schema({
  storeName: String,	// 早餐店名稱 = '味佳奇早餐'
  storeImag: String,	// 早餐店 Logo 存放路徑 = 'merchant1/merchant01.jpg'
  merchantId: String,	// 早餐店ID = 'store4'	  
  // url: String,			// url = merchantId, 例如 url: '/store4'
  category: [String],	// 早餐店狀態，例如 ['Open', 'OnlinePay'] Open 營業中, OnlinePay 可線上支付 
  storeAddress: String,	// 早餐店地址 = '台北市士林區社中街344號'
});

module.exports = mongoose.model('Shop', shopSchema, 'merchant');