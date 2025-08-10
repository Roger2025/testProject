const SetMenu = require('../models/merchant/merchantSetMenu');
const path = require('path');
const fs = require('fs');

const merchantSetMenuController = {
  // 取得列表
  async getSetMenus(req, res) {
    try {
      let merchantId = req.params.merchantId || req.body.merchantId;
      if (Array.isArray(merchantId)) merchantId = merchantId[0];

      const filter = {
        merchantId,
        isDeleted: { $ne: true }
      };
      if (req.query.available !== undefined) {
        filter.available = req.query.available === 'true';
      }
      if (req.query.type) {
        filter.type = req.query.type;
      }

      const setMenus = await SetMenu.find(filter)
        .populate({
          path: 'items.menuId',
          select: 'name price imageUrl isAvailable description'
        })
        .sort({ createdAt: -1 })
        .select('-__v');

      const withImageUrl = setMenus.map(item => ({
        ...item.toObject(),
        imageUrl: item.imagePath ? `/images/${item.imagePath.replace(/\\+/g, '/')}` : item.imageUrl || null
      }));

      res.status(200).json({
        success: true,
        data: withImageUrl
      });
    } catch (err) {
      console.error('取得套餐列表錯誤:', err);
      res.status(500).json({
        success: false,
        message: '取得套餐列表失敗',
        error: err.message
      });
    }
  },

  // 取得單一
  async getSetMenu(req, res) {
    try {
      let merchantId = req.params.merchantId || req.body.merchantId;
      if (Array.isArray(merchantId)) merchantId = merchantId[0];

      const setMenu = await SetMenu.findOne({
        _id: req.params.id,
        merchantId,
        isDeleted: { $ne: true }
      })
        .populate({
          path: 'items.menuId',
          select: 'name price imageUrl isAvailable description'
        })
        .select('-__v');

      if (!setMenu) {
        return res.status(404).json({ success: false, message: '找不到該套餐' });
      }

      const result = {
        ...setMenu.toObject(),
        imageUrl: setMenu.imagePath ? `/images/${setMenu.imagePath.replace(/\\+/g, '/')}` : setMenu.imageUrl || null
      };

      res.status(200).json({ success: true, data: result });
    } catch (err) {
      console.error('取得單一套餐錯誤:', err);
      res.status(500).json({
        success: false,
        message: '取得單一套餐失敗',
        error: err.message
      });
    }
  },

  // 建立
  async createSetMenu(req, res) {
    try {
      let merchantId = req.body.merchantId || req.params.merchantId;
      if (Array.isArray(merchantId)) merchantId = merchantId[0];

      const {
        name,
        description,
        price,
        available,
        type,
        items,
        tags,
        validFrom,
        validUntil,
        dailyLimit
      } = req.body;

      if (!merchantId || !name || price === undefined || !items || !Array.isArray(items) || items.length === 0) {
        return res.status(400).json({
          success: false,
          message: '缺少必要欄位'
        });
      }

      let imagePath = null;
      if (req.file) {
        imagePath = path.join(merchantId, 'setmenu', req.file.filename).replace(/\\+/g, '/');
      }

      const setMenuData = {
        name: name.trim(),
        description: description?.trim() || '',
        price: Math.round(Number(price)),
        imagePath,
        available: available === undefined ? true : (available === 'true' || available === true),
        merchantId,
        type: type || 'breakfast',
        items,
        tags: tags || [],
        validFrom: validFrom ? new Date(validFrom) : new Date(),
        validUntil: validUntil ? new Date(validUntil) : null,
        dailyLimit: dailyLimit || null,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const newSetMenu = new SetMenu(setMenuData);
      const saved = await newSetMenu.save();

      const populated = await SetMenu.findById(saved._id)
        .populate({
          path: 'items.menuId',
          select: 'name price imageUrl isAvailable description'
        });

      const response = {
        ...populated.toObject(),
        imageUrl: imagePath ? `/images/${imagePath}` : populated.imageUrl || null
      };

      res.status(201).json({ success: true, message: '新增套餐成功', data: response });
    } catch (err) {
      console.error('新增套餐錯誤:', err);
      if (err.name === 'ValidationError') {
        return res.status(400).json({
          success: false,
          message: '資料驗證失敗',
          errors: Object.values(err.errors).map(e => ({ field: e.path, message: e.message }))
        });
      }
      res.status(500).json({ success: false, message: '新增套餐失敗', error: err.message });
    }
  },

  // 更新
  async updateSetMenu(req, res) {
    try {
      let merchantId = req.body.merchantId || req.params.merchantId;
      if (Array.isArray(merchantId)) merchantId = merchantId[0];

      const updateData = {};
      const allowed = ['name', 'description', 'price', 'available', 'type', 'items', 'tags', 'validFrom', 'validUntil', 'dailyLimit'];
      allowed.forEach(field => {
        if (req.body[field] !== undefined) {
          updateData[field] = req.body[field];
        }
      });

      if (updateData.price !== undefined) {
        updateData.price = Math.round(Number(updateData.price));
      }
      if (updateData.validFrom) updateData.validFrom = new Date(updateData.validFrom);
      if (updateData.validUntil) updateData.validUntil = new Date(updateData.validUntil);

      // 圖片更新
      if (req.file) {
        if (updateData.imagePath) {
          // delete old handled later if needed
        }
        updateData.imagePath = path.join(merchantId, 'setmenu', req.file.filename).replace(/\\+/g, '/');
      }

      updateData.updatedAt = new Date();

      const updated = await SetMenu.findOneAndUpdate(
        { _id: req.params.id, merchantId, isDeleted: { $ne: true } },
        updateData,
        { new: true, runValidators: true }
      )
        .populate({
          path: 'items.menuId',
          select: 'name price imageUrl isAvailable description'
        })
        .select('-__v');

      if (!updated) {
        return res.status(404).json({ success: false, message: '找不到該套餐' });
      }

      const response = {
        ...updated.toObject(),
        imageUrl: updated.imagePath ? `/images/${updated.imagePath}` : updated.imageUrl || null
      };

      res.status(200).json({ success: true, message: '更新套餐成功', data: response });
    } catch (err) {
      console.error('更新套餐錯誤:', err);
      if (err.name === 'ValidationError') {
        return res.status(400).json({
          success: false,
          message: '資料驗證失敗',
          errors: Object.values(err.errors).map(e => ({ field: e.path, message: e.message }))
        });
      }
      res.status(500).json({ success: false, message: '更新套餐失敗', error: err.message });
    }
  },

  // 刪除
  async deleteSetMenu(req, res) {
    try {
      let merchantId = req.body.merchantId || req.params.merchantId;
      if (Array.isArray(merchantId)) merchantId = merchantId[0];

      const setMenu = await SetMenu.findOne({
        _id: req.params.id,
        merchantId,
        isDeleted: { $ne: true }
      });

      if (!setMenu) {
        return res.status(404).json({ success: false, message: '找不到該套餐' });
      }

      await SetMenu.findByIdAndUpdate(req.params.id, {
        isDeleted: true,
        deletedAt: new Date()
      });

      // 可選：刪除圖片
      if (setMenu.imagePath) {
        const imageFullPath = path.join(__dirname, '../public', setMenu.imagePath);
        fs.unlink(imageFullPath, (e) => { if (e) console.error('刪除圖片失敗:', e); });
      }

      res.status(200).json({ success: true, message: '刪除套餐成功' });
    } catch (err) {
      console.error('刪除套餐錯誤:', err);
      res.status(500).json({ success: false, message: '刪除套餐失敗', error: err.message });
    }
  },

  // 切換上下架
  async toggleAvailability(req, res) {
    try {
      let merchantId = req.body.merchantId || req.params.merchantId;
      if (Array.isArray(merchantId)) merchantId = merchantId[0];

      const setMenu = await SetMenu.findOne({
        _id: req.params.id,
        merchantId,
        isDeleted: { $ne: true }
      });

      if (!setMenu) {
        return res.status(404).json({ success: false, message: '找不到該套餐' });
      }

      setMenu.available = !setMenu.available;
      await setMenu.save();

      res.status(200).json({
        success: true,
        message: `套餐已${setMenu.available ? '上架' : '下架'}`,
        data: { id: setMenu._id, available: setMenu.available }
      });
    } catch (err) {
      console.error('切換套餐狀態錯誤:', err);
      res.status(500).json({ success: false, message: '切換失敗', error: err.message });
    }
  }
};

module.exports = merchantSetMenuController;