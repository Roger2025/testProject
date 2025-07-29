// controllers/merchantMenuController.js
const MerchantMenu = require('../models/merchant/merchantMenu');
const path = require('path');
const fs = require('fs');

const merchantMenuController = {
  // 獲取商家所有菜單項目
  async getMenuItems(req, res) {
    try {
      const { merchantId } = req.params;
      
      const menuItems = await MerchantMenu.find({ 
        merchantId: merchantId,
        isDeleted: { $ne: true }
      }).sort({ createdAt: -1 });

      // 處理圖片URL
      const itemsWithImageUrl = menuItems.map(item => ({
        ...item.toObject(),
        imageUrl: item.imagePath ? `/public/${item.imagePath}` : null
      }));

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

      // 處理圖片URL
      const itemWithImageUrl = {
        ...menuItem.toObject(),
        imageUrl: menuItem.imagePath ? `/public/${menuItem.imagePath}` : null
      };

      res.status(200).json({
        success: true,
        data: itemWithImageUrl
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

  // 創建新的菜單項目
  async createMenuItem(req, res) {
    try {
      const { merchantId, name, description, price, category, available, notes, options } = req.body;
      
      // 驗證必填欄位
      if (!merchantId || !name || !price || !category) {
        return res.status(400).json({
          success: false,
          message: '請提供必填欄位: merchantId, name, price, category'
        });
      }

      // 處理選項數據
      let parsedOptions = {};
      if (options) {
        try {
          parsedOptions = typeof options === 'string' ? JSON.parse(options) : options;
        } catch (error) {
          console.error('解析選項錯誤:', error);
        }
      }

      // 處理圖片路徑
      let imagePath = null;
      if (req.file) {
        imagePath = path.join(merchantId, req.file.filename);
      }

      // 創建菜單項目
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

      // 返回包含圖片URL的數據
      const responseData = {
        ...savedMenuItem.toObject(),
        imageUrl: imagePath ? `/public/${imagePath}` : null
      };

      res.status(201).json({
        success: true,
        message: '菜單項目創建成功',
        data: responseData
      });
    } catch (error) {
      console.error('創建菜單項目錯誤:', error);
      
      // 如果有上傳的文件但保存失敗，刪除文件
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
  async updateMenuItem(req, res) {
    try {
      const { itemId } = req.params;
      const { name, description, price, category, available, notes, options } = req.body;

      // 查找現有項目
      const existingItem = await MerchantMenu.findOne({
        _id: itemId,
        isDeleted: { $ne: true }
      });

      if (!existingItem) {
        // 如果有新上傳的文件但項目不存在，刪除文件
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

      // 處理選項數據
      let parsedOptions = existingItem.options;
      if (options) {
        try {
          parsedOptions = typeof options === 'string' ? JSON.parse(options) : options;
        } catch (error) {
          console.error('解析選項錯誤:', error);
        }
      }

      // 處理圖片更新
      let imagePath = existingItem.imagePath;
      if (req.file) {
        // 刪除舊圖片
        if (existingItem.imagePath) {
          const oldImagePath = path.join(__dirname, '../public', existingItem.imagePath);
          fs.unlink(oldImagePath, (err) => {
            if (err) console.error('刪除舊圖片錯誤:', err);
          });
        }
        
        // 設置新圖片路徑
        imagePath = path.join(existingItem.merchantId, req.file.filename);
      }

      // 更新數據
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

      // 返回包含圖片URL的數據
      const responseData = {
        ...updatedMenuItem.toObject(),
        imageUrl: imagePath ? `/public/${imagePath}` : null
      };

      res.status(200).json({
        success: true,
        message: '菜單項目更新成功',
        data: responseData
      });
    } catch (error) {
      console.error('更新菜單項目錯誤:', error);
      
      // 如果有新上傳的文件但更新失敗，刪除文件
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

      // 軟刪除
      await MerchantMenu.findByIdAndUpdate(itemId, {
        isDeleted: true,
        deletedAt: new Date()
      });

      // 可選：實際刪除圖片文件
      if (menuItem.imagePath) {
        const imagePath = path.join(__dirname, '../public', menuItem.imagePath);
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
      const { merchantId } = req.params;
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