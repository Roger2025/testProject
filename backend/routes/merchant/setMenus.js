// routes/setMenus.js
const express = require('express');
const router = express.Router();
const { body, validationResult, param, query } = require('express-validator');
const SetMenu = require('../../models/merchant/merchantSetMenu');

// 驗證中間件
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

// GET /api/set-menus - 取得套餐列表
router.get('/', [
  query('merchantId')
    .notEmpty()
    .withMessage('商家ID為必填')
    .isMongoId()
    .withMessage('無效的商家ID格式'),
  handleValidationErrors
], async (req, res) => {
  try {
    const { merchantId, type, available } = req.query;
    
    // 建立查詢條件
    const filter = { merchantId };
    
    if (type) {
      filter.type = type;
    }
    
    if (available !== undefined) {
      filter.available = available === 'true';
    }

    const setMenus = await SetMenu.find(filter)
      .populate({
        path: 'items.menuId',
        select: 'name price imageUrl isAvailable'
      })
      .sort({ createdAt: -1 })
      .select('-__v');

    res.json({
      success: true,
      message: '取得套餐列表成功',
      data: setMenus,
      count: setMenus.length
    });

  } catch (error) {
    console.error('取得套餐列表錯誤:', error);
    res.status(500).json({
      success: false,
      message: '伺服器錯誤',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// GET /api/set-menus/:id - 取得單一套餐
router.get('/:id', [
  param('id')
    .isMongoId()
    .withMessage('無效的套餐ID格式'),
  handleValidationErrors
], async (req, res) => {
  try {
    const setMenu = await SetMenu.findById(req.params.id)
      .populate({
        path: 'items.menuId',
        select: 'name price imageUrl isAvailable description'
      })
      .select('-__v');
    
    if (!setMenu) {
      return res.status(404).json({
        success: false,
        message: '找不到該套餐'
      });
    }

    res.json({
      success: true,
      message: '取得套餐成功',
      data: setMenu
    });

  } catch (error) {
    console.error('取得套餐錯誤:', error);
    res.status(500).json({
      success: false,
      message: '伺服器錯誤',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// POST /api/set-menus - 新增套餐
router.post('/', [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('套餐名稱為必填')
    .isLength({ max: 100 })
    .withMessage('套餐名稱不能超過100個字元'),
  body('description')
    .trim()
    .notEmpty()
    .withMessage('套餐描述為必填')
    .isLength({ max: 1000 })
    .withMessage('描述不能超過1000個字元'),
  body('price')
    .isNumeric()
    .withMessage('價格必須為數字')
    .custom(value => {
      if (value < 0) {
        throw new Error('價格不能為負數');
      }
      return true;
    }),
  body('imageUrl')
    .optional()
    .trim()
    .isURL()
    .withMessage('請提供有效的圖片網址'),
  body('available')
    .optional()
    .isBoolean()
    .withMessage('上架狀態必須為布林值'),
  body('merchantId')
    .notEmpty()
    .withMessage('商家ID為必填')
    .isMongoId()
    .withMessage('無效的商家ID格式'),
  body('type')
    .optional()
    .isIn(['早餐套餐', '午餐套餐', '下午茶套餐', '特色套餐', '優惠套餐'])
    .withMessage('無效的套餐類型'),
  body('items')
    .isArray({ min: 1 })
    .withMessage('套餐至少需要包含一個餐點'),
  body('items.*.menuId')
    .isMongoId()
    .withMessage('無效的餐點ID格式'),
  body('items.*.quantity')
    .isInt({ min: 1 })
    .withMessage('數量至少為1'),
  handleValidationErrors
], async (req, res) => {
  try {
    const setMenuData = {
      name: req.body.name,
      description: req.body.description,
      price: Math.round(req.body.price),
      imageUrl: req.body.imageUrl,
      available: req.body.available ?? true,
      merchantId: req.body.merchantId,
      type: req.body.type || '早餐套餐',
      items: req.body.items,
      tags: req.body.tags || [],
      validFrom: req.body.validFrom ? new Date(req.body.validFrom) : new Date(),
      validUntil: req.body.validUntil ? new Date(req.body.validUntil) : null,
      dailyLimit: req.body.dailyLimit || null
    };

    const newSetMenu = new SetMenu(setMenuData);
    const savedSetMenu = await newSetMenu.save();

    // 填充餐點資料後回傳
    const populatedSetMenu = await SetMenu.findById(savedSetMenu._id)
      .populate({
        path: 'items.menuId',
        select: 'name price imageUrl isAvailable'
      });

    res.status(201).json({
      success: true,
      message: '新增套餐成功',
      data: populatedSetMenu
    });

  } catch (error) {
    console.error('新增套餐錯誤:', error);
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: '資料驗證失敗',
        errors: Object.values(error.errors).map(err => ({
          field: err.path,
          message: err.message
        }))
      });
    }

    res.status(500).json({
      success: false,
      message: '伺服器錯誤',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// PUT /api/set-menus/:id - 更新套餐
router.put('/:id', [
  param('id')
    .isMongoId()
    .withMessage('無效的套餐ID格式'),
  body('name')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('套餐名稱不能為空')
    .isLength({ max: 100 })
    .withMessage('套餐名稱不能超過100個字元'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('描述不能超過1000個字元'),
  body('price')
    .optional()
    .isNumeric()
    .withMessage('價格必須為數字')
    .custom(value => {
      if (value < 0) {
        throw new Error('價格不能為負數');
      }
      return true;
    }),
  body('imageUrl')
    .optional()
    .trim()
    .isURL()
    .withMessage('請提供有效的圖片網址'),
  body('available')
    .optional()
    .isBoolean()
    .withMessage('上架狀態必須為布林值'),
  body('items')
    .optional()
    .isArray({ min: 1 })
    .withMessage('套餐至少需要包含一個餐點'),
  handleValidationErrors
], async (req, res) => {
  try {
    const updateData = {};
    
    // 只更新提供的欄位
    const allowedFields = ['name', 'description', 'price', 'imageUrl', 'available', 'type', 'items', 'tags', 'validFrom', 'validUntil', 'dailyLimit'];
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        updateData[field] = req.body[field];
      }
    });

    // 確保價格為整數
    if (updateData.price) {
      updateData.price = Math.round(updateData.price);
    }

    // 處理日期欄位
    if (updateData.validFrom) {
      updateData.validFrom = new Date(updateData.validFrom);
    }
    if (updateData.validUntil) {
      updateData.validUntil = new Date(updateData.validUntil);
    }

    const updatedSetMenu = await SetMenu.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).populate({
      path: 'items.menuId',
      select: 'name price imageUrl isAvailable'
    }).select('-__v');

    if (!updatedSetMenu) {
      return res.status(404).json({
        success: false,
        message: '找不到該套餐'
      });
    }

    res.json({
      success: true,
      message: '更新套餐成功',
      data: updatedSetMenu
    });

  } catch (error) {
    console.error('更新套餐錯誤:', error);
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: '資料驗證失敗',
        errors: Object.values(error.errors).map(err => ({
          field: err.path,
          message: err.message
        }))
      });
    }

    res.status(500).json({
      success: false,
      message: '伺服器錯誤',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// DELETE /api/set-menus/:id - 刪除套餐
router.delete('/:id', [
  param('id')
    .isMongoId()
    .withMessage('無效的套餐ID格式'),
  handleValidationErrors
], async (req, res) => {
  try {
    const deletedSetMenu = await SetMenu.findByIdAndDelete(req.params.id);

    if (!deletedSetMenu) {
      return res.status(404).json({
        success: false,
        message: '找不到該套餐'
      });
    }

    res.json({
      success: true,
      message: '刪除套餐成功',
      data: { id: req.params.id }
    });

  } catch (error) {
    console.error('刪除套餐錯誤:', error);
    res.status(500).json({
      success: false,
      message: '伺服器錯誤',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// PATCH /api/set-menus/:id/toggle - 切換套餐上架狀態
router.patch('/:id/toggle', [
  param('id')
    .isMongoId()
    .withMessage('無效的套餐ID格式'),
  handleValidationErrors
], async (req, res) => {
  try {
    const setMenu = await SetMenu.findById(req.params.id);
    
    if (!setMenu) {
      return res.status(404).json({
        success: false,
        message: '找不到該套餐'
      });
    }

    await setMenu.toggleAvailability();

    res.json({
      success: true,
      message: `套餐已${setMenu.available ? '上架' : '下架'}`,
      data: { 
        id: setMenu._id, 
        available: setMenu.available 
      }
    });

  } catch (error) {
    console.error('切換套餐狀態錯誤:', error);
    res.status(500).json({
      success: false,
      message: '伺服器錯誤',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

module.exports = router;