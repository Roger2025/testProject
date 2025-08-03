const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const merchantMenuController = require('../../controllers/merchantMenuController');

// 類別對應表（保留如未來需要用）
const CATEGORY_MAP = {
  burger: 'burger',
  'egg-pancake': 'egg-pancake',
  toast: 'toast',
  noodles: 'noodles',
  single: 'single',
  drink: 'drink'
};

function getCategoryName(category) {
  return CATEGORY_MAP[category] || 'single';
}

// normalizeMerchantId middleware：從 params 或 body (array 情況) 拿出第一個 merchantId
function normalizeMerchantId(req, res, next) {
  if (req.params.merchantId) {
    req.body.merchantId = req.params.merchantId;
  } else if (req.body.merchantId) {
    if (Array.isArray(req.body.merchantId)) {
      req.body.merchantId = req.body.merchantId[0];
    }
    // else leave as is
  }
  next();
}

// multer storage 配置（產生路徑跟流水號檔名）
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const merchantId = req.body.merchantId || req.params.merchantId;
    const category = req.body.category || 'single';
    const categoryName = getCategoryName(category);
    const uploadPath = path.join(__dirname, '../../public/images', merchantId, categoryName);

    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
      console.log(`建立目錄: ${uploadPath}`);
    }

    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const merchantId = req.body.merchantId || req.params.merchantId;
    const category = req.body.category || 'single';
    const categoryName = getCategoryName(category);
    const ext = path.extname(file.originalname);
    const directoryPath = path.join(__dirname, '../../public/images', merchantId, categoryName);

    let sequenceNumber = 0;
    try {
      if (fs.existsSync(directoryPath)) {
        const files = fs.readdirSync(directoryPath);
        const categoryFiles = files.filter(f => f.startsWith(categoryName));
        const sequenceNumbers = categoryFiles
          .map(fn => {
            const match = fn.match(new RegExp(`^${categoryName}(\\d+)`));
            return match ? parseInt(match[1], 10) : -1;
          })
          .filter(n => n !== -1);
        sequenceNumber = sequenceNumbers.length > 0 ? Math.max(...sequenceNumbers) + 1 : 0;
      }
    } catch (err) {
      console.error('獲取流水號失敗:', err);
      sequenceNumber = Date.now();
    }

    const filename = `${categoryName}${sequenceNumber}${ext}`;
    console.log(`生成檔名: ${filename}`);
    cb(null, filename);
  }
});

// 檔案過濾器
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('只允許上傳圖片檔案 (JPEG, PNG, GIF, WebP)'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 300 * 1024 // 300KB
  }
});

// 全部先 normalize merchantId
router.use(normalizeMerchantId);

// 路由
router.get('/:merchantId/menu', merchantMenuController.getMenuItems);
router.get('/:merchantId/menu/:itemId', merchantMenuController.getMenuItem);

router.post('/:merchantId/menu',
  upload.single('image'),
  merchantMenuController.createMenuItem
);

router.put('/:merchantId/menu/:itemId',
  upload.single('image'),
  merchantMenuController.updateMenuItem
);

// 刪除前的舊圖刪除已交給 controller，這裡只直接呼叫
router.delete('/:merchantId/menu/:itemId', merchantMenuController.deleteMenuItem);

router.patch('/:merchantId/menu/batch-status', merchantMenuController.updateMenuItemsStatus);

// 錯誤處理（Multer 相關）
router.use((error, req, res, next) => {
  if (req.file) {
    // 上傳出錯時清理暫存文件
    const filePath = req.file.path;
    fs.unlink(filePath, (err) => {
      if (err) console.error('清理檔案失敗:', err);
    });
  }

  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: '檔案大小超過限制 (300KB)'
      });
    }
    if (error.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(400).json({
        success: false,
        message: '意外的檔案上傳'
      });
    }
  }

  if (error.message && error.message.includes('只允許上傳圖片檔案')) {
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }

  console.error('檔案上傳錯誤:', error);
  res.status(500).json({
    success: false,
    message: '檔案上傳失敗',
    error: error.message || String(error)
  });
});

module.exports = router;