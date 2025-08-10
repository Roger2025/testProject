// routes/merchant/merchantSetMenu.js
const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const { body, param, query, validationResult } = require('express-validator');
const merchantSetMenuController = require('../../controllers/merchantSetMenuController');

// normalizeMerchantId middleware (優先使用 path param)
function normalizeMerchantId(req, res, next) {
  if (req.params.merchantId) {
    req.body.merchantId = req.params.merchantId;
  }
  next();
}

// file storage setup: public/images/{merchantId}/setmenu/
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const merchantId = req.body.merchantId || req.params.merchantId;
    const uploadPath = path.join(__dirname, '../../public/images', merchantId, 'setmenu');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
      console.log(`建立目錄: ${uploadPath}`);
    }
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    // 用 timestamp+原始名字避免衝突也可照你的規則改
    const filename = `setmenu_${Date.now()}${ext}`;
    cb(null, filename);
  }
});

// 只接受圖片
const fileFilter = (req, file, cb) => {
  const allowed = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  if (allowed.includes(file.mimetype)) cb(null, true);
  else cb(new Error('只允許上傳圖片檔案 (JPEG, PNG, GIF, WebP)'), false);
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 300 * 1024 } // 300KB
});

// validation error handler
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: '資料驗證失敗',
      errors: errors.array()
    });
  }
  next();
};

// 全部路由先 normalize merchantId
router.use(normalizeMerchantId);

// 取得套餐列表
router.get(
  '/:merchantId/setmenu',
  [
    param('merchantId').notEmpty().withMessage('商家ID為必填')
  ],
  handleValidationErrors,
  merchantSetMenuController.getSetMenus
);

// 取得單一套餐
router.get(
  '/:merchantId/setmenu/:id',
  [
    param('merchantId').notEmpty().withMessage('商家ID為必填'),
    param('id').isMongoId().withMessage('無效的套餐ID格式')
  ],
  handleValidationErrors,
  merchantSetMenuController.getSetMenu
);

// 建立套餐
router.post(
  '/:merchantId/setmenu',
  upload.single('image'),
  [
    param('merchantId').notEmpty().withMessage('商家ID為必填'),
    body('name').trim().notEmpty().withMessage('套餐名稱為必填'),
    body('price').isNumeric().withMessage('價格必須為數字'),
    body('items').isArray({ min: 1 }).withMessage('套餐至少要包含一個餐點'),
    body('items.*.menuId').isMongoId().withMessage('無效的餐點ID格式'),
    body('items.*.quantity').isInt({ min: 1 }).withMessage('數量至少為1'),
  ],
  handleValidationErrors,
  merchantSetMenuController.createSetMenu
);

// 更新套餐
router.put(
  '/:merchantId/setmenu/:id',
  upload.single('image'),
  [
    param('merchantId').notEmpty().withMessage('商家ID為必填'),
    param('id').isMongoId().withMessage('無效的套餐ID格式'),
  ],
  handleValidationErrors,
  merchantSetMenuController.updateSetMenu
);

// 刪除套餐
router.delete(
  '/:merchantId/setmenu/:id',
  [
    param('merchantId').notEmpty().withMessage('商家ID為必填'),
    param('id').isMongoId().withMessage('無效的套餐ID格式')
  ],
  handleValidationErrors,
  merchantSetMenuController.deleteSetMenu
);

// 切換上下架
router.patch(
  '/:merchantId/setmenu/:id/toggle',
  [
    param('merchantId').notEmpty().withMessage('商家ID為必填'),
    param('id').isMongoId().withMessage('無效的套餐ID格式')
  ],
  handleValidationErrors,
  merchantSetMenuController.toggleAvailability
);

// 錯誤處理（upload 等）
router.use((error, req, res, next) => {
  if (req.file) {
    fs.unlink(req.file.path, () => {});
  }
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ success: false, message: '檔案大小超過限制 (300KB)' });
    }
  }
  if (error.message?.includes('只允許上傳圖片檔案')) {
    return res.status(400).json({ success: false, message: error.message });
  }
  console.error('套餐路由錯誤:', error);
  res.status(500).json({ success: false, message: '伺服器錯誤', error: error.message });
});

module.exports = router;