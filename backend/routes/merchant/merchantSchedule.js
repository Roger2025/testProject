const express = require('express');
const router = express.Router();
const {
  getMerchantSchedule,
  updateMerchantSchedule,
  checkMerchantStatus,
  getWeeklyScheduleOverview
} = require('../../controllers/merchantScheduleController');

// 獲取商家營業排程
// GET /merchant/schedule/:merchantId
router.get('/:merchantId', getMerchantSchedule);

// 更新商家營業排程
// PUT /merchant/schedule/:merchantId
router.put('/:merchantId', updateMerchantSchedule);

// 檢查商家當前營業狀態
// GET /merchant/schedule/:merchantId/status
router.get('/:merchantId/status', checkMerchantStatus);

// 獲取商家一週營業概況
// GET /merchant/schedule/:merchantId/overview
router.get('/:merchantId/overview', getWeeklyScheduleOverview);

module.exports = router;