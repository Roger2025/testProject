const MerchantMenu = require('../models/merchant/merchantMenu');
const path = require('path');
const fs = require('fs');

// helper: 從 req.params 或 req.body（支援 array）提取 merchantId
function extractMerchantId(req) {
  let raw = req.params.merchantId || req.body.merchantId;
  if (Array.isArray(raw)) raw = raw[0];
  return raw;
}

// helper：根據 item.imagePath 與 category 提供最終可用的 imageUrl
function buildImageUrl(item) {
  if (!item.imagePath) return null;

  // 統一為 forward slash
  let normalizedPath = item.imagePath.replace(/\\+/g, '/'); // e.g., default_merchant/burger2.jpg or default_merchant/burger/burger2.jpg
  let imageUrl = `/images/${normalizedPath}`; // 預設

  const fullPhysical = path.join(__dirname, '../public', normalizedPath);
  if (fs.existsSync(fullPhysical)) {
    return imageUrl;
  }

  // fallback：若缺 category 夾層（像 default_merchant/burger2.jpg），嘗試插入 item.category
  if (item.category) {
    const parts = normalizedPath.split('/');
    if (parts.length === 2) {
      const merchantId = parts[0];
      const filename = parts[1];
      const fallbackPath = path.posix.join(merchantId, item.category, filename); // default_merchant/burger/burger2.jpg
      const fallbackPhysical = path.join(__dirname, '../public', fallbackPath);
      if (fs.existsSync(fallbackPhysical)) {
        return `/images/${fallbackPath}`;
      }
    }
  }

  // 最後退回原始（即便可能 404）
  return imageUrl;
}

const merchantMenuController = {

  // 獲取商家所有菜單項目
  async getMenuItems(req, res) {
    try {
      const { merchantId } = req.params;

      const menuItems = await MerchantMenu.find({
        merchantId: merchantId,
        isDeleted: { $ne: true }
      }).sort({ createdAt: -1 });

      const itemsWithImageUrl = menuItems.map(item => {
        const obj = item.toObject();
        return {
          ...obj,
          imageUrl: buildImageUrl(obj)
        };
      });

      res.status(200).json({
        success: true,
        data: itemsWithImageUrl
      });
    } catch (error) {
      console.error('獲取菜單項目錯誤:', error);
      res.status(500).json({
        success: false,
        message: '獲取菜單項目失敗',
        error: error.message
      });
    }
  },

  // 獲取單個菜單項目
  async getMenuItem(req, res) {
    try {
      const { merchantId, itemId } = req.params;

      const menuItem = await MerchantMenu.findOne({
        _id: itemId,
        merchantId: merchantId,
        isDeleted: { $ne: true }
      });

      if (!menuItem) {
        return res.status(404).json({
          success: false,
          message: '菜單項目不存在'
        });
      }

      const obj = menuItem.toObject();
      const itemWithImageUrl = {
        ...obj,
        imageUrl: buildImageUrl(obj)
      };

      res.status(200).json({
        success: true,
        data: itemWithImageUrl
      });
    } catch (error) {
      console.error('獲取單個菜單項目錯誤:', error);
      res.status(500).json({
        success: false,
        message: '獲取單個菜單項目失敗',
        error: error.message
      });
    }
  },

// 創建新的菜單項目
  async createMenuItem(req, res) {
    console.log('received req.file:', req.file);
    console.log('received req.body:', req.body);
    try {
      // normalize merchantId
      let merchantIdRaw = req.body.merchantId;
      let merchantId = Array.isArray(merchantIdRaw) ? merchantIdRaw[0] : merchantIdRaw;
      if (req.params.merchantId) {
        merchantId = req.params.merchantId;
      }
      req.body.merchantId = merchantId;

      const { name, description, price, category, available, notes, options } = req.body;

      if (!merchantId || !name || !price || !category) {
        return res.status(400).json({
          success: false,
          message: '請提供必填欄位: merchantId, name, price, category'
        });
      }

      let parsedOptions = {};
      if (options) {
        try {
          parsedOptions = typeof options === 'string' ? JSON.parse(options) : options;
        } catch (error) {
          console.error('解析選項錯誤:', error);
        }
      }

      let imagePath = null;
      if (req.file) {
        // 把 category folder 加進去，並用 posix 正規化斜線
        const categoryName = category;
        imagePath = path.posix.join(merchantId, categoryName, req.file.filename);
      }

      const menuItem = new MerchantMenu({
        merchantId,
        name: name.trim(),
        description: description?.trim() || '',
        price: parseFloat(price),
        category,
        available: available === 'true' || available === true,
        notes: notes?.trim() || '',
        options: parsedOptions,
        imagePath,
        createdAt: new Date(),
        updatedAt: new Date()
      });

      const savedMenuItem = await menuItem.save();

      const responseData = {
        ...savedMenuItem.toObject(),
        imageUrl: imagePath ? `/images/${imagePath}` : null
      };

      res.status(201).json({
        success: true,
        message: '菜單項目創建成功',
        data: responseData
      });
    } catch (error) {
      console.error('創建菜單項目錯誤:', error);
      if (req.file) {
        fs.unlink(req.file.path, (err) => {
          if (err) console.error('刪除文件錯誤:', err);
        });
      }
      res.status(500).json({
        success: false,
        message: '創建菜單項目失敗',
        error: error.message
      });
    }
  },


  // 更新菜單項目
// 更新菜單項目
  async updateMenuItem(req, res) {
    console.log('received req.file:', req.file);
    console.log('received req.body:', req.body);
    try {
      // normalize merchantId (雖然通常用 params)
      let merchantIdRaw = req.body.merchantId;
      let merchantId = Array.isArray(merchantIdRaw) ? merchantIdRaw[0] : merchantIdRaw;
      if (req.params.merchantId) {
        merchantId = req.params.merchantId;
      }
      req.body.merchantId = merchantId;

      const { itemId } = req.params;
      const { name, description, price, category, available, notes, options } = req.body;

      const existingItem = await MerchantMenu.findOne({
        _id: itemId,
        isDeleted: { $ne: true }
      });

      if (!existingItem) {
        if (req.file) {
          fs.unlink(req.file.path, (err) => {
            if (err) console.error('刪除文件錯誤:', err);
          });
        }
        return res.status(404).json({
          success: false,
          message: '菜單項目不存在'
        });
      }

      let parsedOptions = existingItem.options;
      if (options) {
        try {
          parsedOptions = typeof options === 'string' ? JSON.parse(options) : options;
        } catch (error) {
          console.error('解析選項錯誤:', error);
        }
      }

      // 預設使用現有 imagePath
      let imagePath = existingItem.imagePath;
      if (req.file) {
        // 刪除舊圖片（existingItem.imagePath 可能包含不一致斜線）
        if (existingItem.imagePath) {
          const oldImagePath = path.join(__dirname, '../public', existingItem.imagePath);
          fs.unlink(oldImagePath, (err) => {
            if (err) console.error('刪除舊圖片錯誤:', err);
          });
        }
        // 新 imagePath 需包含 category folder（優先用 body 的 category）
        const categoryName = category || existingItem.category;
        imagePath = path.posix.join(existingItem.merchantId, categoryName, req.file.filename);
      }

      const updateData = {
        name: name?.trim() || existingItem.name,
        description: description?.trim() || existingItem.description,
        price: price ? parseFloat(price) : existingItem.price,
        category: category || existingItem.category,
        available: available !== undefined ? (available === 'true' || available === true) : existingItem.available,
        notes: notes?.trim() || existingItem.notes,
        options: parsedOptions,
        imagePath,
        updatedAt: new Date()
      };

      const updatedMenuItem = await MerchantMenu.findByIdAndUpdate(
        itemId,
        updateData,
        { new: true, runValidators: true }
      );

      const responseData = {
        ...updatedMenuItem.toObject(),
        imageUrl: imagePath ? `/images/${imagePath}` : null
      };

      res.status(200).json({
        success: true,
        message: '菜單項目更新成功',
        data: responseData
      });
    } catch (error) {
      console.error('更新菜單項目錯誤:', error);
      if (req.file) {
        fs.unlink(req.file.path, (err) => {
          if (err) console.error('刪除文件錯誤:', err);
        });
      }
      res.status(500).json({
        success: false,
        message: '更新菜單項目失敗',
        error: error.message
      });
    }
  },

  // 刪除菜單項目 (軟刪除)
  async deleteMenuItem(req, res) {
    try {
      const { itemId } = req.params;

      const menuItem = await MerchantMenu.findOne({
        _id: itemId,
        isDeleted: { $ne: true }
      });

      if (!menuItem) {
        return res.status(404).json({
          success: false,
          message: '菜單項目不存在'
        });
      }

      await MerchantMenu.findByIdAndUpdate(itemId, {
        isDeleted: true,
        deletedAt: new Date()
      });

      if (menuItem.imagePath) {
        const imagePath = path.join(__dirname, '../public/images', menuItem.imagePath);
        fs.unlink(imagePath, (err) => {
          if (err) console.error('刪除圖片文件錯誤:', err);
        });
      }

      res.status(200).json({
        success: true,
        message: '菜單項目刪除成功'
      });
    } catch (error) {
      console.error('刪除菜單項目錯誤:', error);
      res.status(500).json({
        success: false,
        message: '刪除菜單項目失敗',
        error: error.message
      });
    }
  },

  // 批量更新菜單項目狀態
  async updateMenuItemsStatus(req, res) {
    try {
      const merchantId = extractMerchantId(req);
      req.body.merchantId = merchantId;

      const { itemIds, available } = req.body;

      if (!Array.isArray(itemIds) || itemIds.length === 0) {
        return res.status(400).json({
          success: false,
          message: '請提供有效的項目ID列表'
        });
      }

      const result = await MerchantMenu.updateMany(
        {
          _id: { $in: itemIds },
          merchantId: merchantId,
          isDeleted: { $ne: true }
        },
        {
          available: available,
          updatedAt: new Date()
        }
      );

      res.status(200).json({
        success: true,
        message: `成功更新 ${result.modifiedCount} 個項目的狀態`,
        data: {
          matchedCount: result.matchedCount,
          modifiedCount: result.modifiedCount
        }
      });
    } catch (error) {
      console.error('批量更新狀態錯誤:', error);
      res.status(500).json({
        success: false,
        message: '批量更新狀態失敗',
        error: error.message
      });
    }
  }
};

module.exports = merchantMenuController;