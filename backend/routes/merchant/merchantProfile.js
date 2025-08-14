// backend/routes/merchant/merchantProfile.js
const express = require('express');
const router = express.Router();
const {
  getMerchantProfile,
  updateMerchantProfile,
  uploadMerchantLogo,
  deleteMerchantLogo
} = require('../../controllers/merchantProfileController');

// 中間件：驗證 merchantId 參數
const validateMerchantId = (req, res, next) => {
  const { merchantId } = req.params;
  if (!merchantId) {
    return res.status(400).json({
      success: false,
      message: '缺少商家 ID'
    });
  }
  next();
};

// 取得商家基本資料
// GET /api/merchant/:merchantId/profile
router.get('/:merchantId/profile', validateMerchantId, getMerchantProfile);

// 更新商家基本資料  
// PUT /api/merchant/:merchantId/profile
router.put('/:merchantId/profile', validateMerchantId, updateMerchantProfile);

// 上傳商家 Logo
// POST /api/merchant/:merchantId/upload/logo
router.post('/:merchantId/upload/logo', validateMerchantId, uploadMerchantLogo);

// 刪除商家 Logo
// DELETE /api/merchant/:merchantId/upload/logo
router.delete('/:merchantId/upload/logo', validateMerchantId, deleteMerchantLogo);

module.exports = router;