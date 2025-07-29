// routes/merchantMenu.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const merchantMenuController = require('../../controllers/merchantMenuController');

// 設置圖片上傳中間件
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const merchantId = req.body.merchantId || req.params.merchantId;
    const uploadPath = path.join(__dirname, '../public', merchantId);
    
    // 確保目錄存在
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const merchantId = req.body.merchantId || req.params.merchantId;
    const category = req.body.category || '01'; // 預設早餐類
    const categoryCode = getCategoryCode(category);
    const timestamp = Date.now();
    const ext = path.extname(file.originalname);
    
    // 格式: 商家ID_菜單種類號碼_品項編號.副檔名
    const filename = `${merchantId}_${categoryCode}_${timestamp}${ext}`;
    cb(null, filename);
  }
});

// 文件過濾器
const fileFilter = (req, file, cb) => {
  // 只允許圖片文件
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('只允許上傳圖片文件'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB 限制
  }
});

// 獲取類別代碼的輔助函數
function getCategoryCode(category) {
  const categoryMap = {
    'burger': '01',        // 漢堡類
    'egg-pancake': '02',   // 蛋餅類
    'toast': '03',         // 吐司類
    'noodles': '04',       // 麵食類
    'single': '05',        // 單品類
    'drink': '06'          // 飲料類
  };
  return categoryMap[category] || '01';
}

// 路由定義

// 獲取商家所有菜單項目
router.get('/:merchantId/menu', merchantMenuController.getMenuItems);

// 獲取單個菜單項目
router.get('/:merchantId/menu/:itemId', merchantMenuController.getMenuItem);

// 創建新的菜單項目
router.post('/menu', 
  upload.single('image'), 
  merchantMenuController.createMenuItem
);

// 更新菜單項目
router.put('/menu/:itemId', 
  upload.single('image'), 
  merchantMenuController.updateMenuItem
);

// 刪除菜單項目
router.delete('/menu/:itemId', merchantMenuController.deleteMenuItem);

// 批量更新菜單項目狀態
router.patch('/:merchantId/menu/batch-status', merchantMenuController.updateMenuItemsStatus);

// 錯誤處理中間件
router.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: '文件大小超過限制 (5MB)'
      });
    }
  }
  
  if (error.message === '只允許上傳圖片文件') {
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }
  
  next(error);
});

module.exports = router;