// backend/controllers/merchantProfileController.js
const Merchant = require('../models/merchant/Todo_merchant');
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;

// === 可選標籤鍵 ===
const CATEGORY_KEYS = ['delivery','online_payment','pickup','cash_only'];
const TAG_KEYS = ['best_seller','popular_item','trending'];

// === Multer：300KB，上傳到 public/images/<merchantId>/Logo.<ext> ===
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const dir = path.join(__dirname, '../public/images', req.params.merchantId);
    try { await fs.mkdir(dir, { recursive: true }); cb(null, dir); }
    catch (err) { cb(err); }
  },
  filename: (req, file, cb) => {
    const extFromName = path.extname(file.originalname || '').toLowerCase();
    const map = { 'image/jpeg': '.jpg', 'image/jpg': '.jpg', 'image/png': '.png', 'image/gif': '.gif', 'image/webp': '.webp' };
    const ext = extFromName || map[(file.mimetype || '').toLowerCase()] || '.jpg';
    cb(null, `Logo${ext}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 300 * 1024 }, // 300KB
  fileFilter: (req, file, cb) => {
    const ok = /image\/(jpeg|jpg|png|gif|webp)/i.test(file.mimetype);
    cb(ok ? null : new Error('只允許上傳 JPG/PNG/GIF/WebP 格式的圖片'), ok);
  }
});

// === 工具：將 category 轉為合法布林物件（允許 array 或 object 輸入） ===
const normalizeCategory = (input) => {
  const out = {};
  if (Array.isArray(input)) {
    for (const k of input) if (CATEGORY_KEYS.includes(String(k))) out[String(k)] = true;
  } else if (input && typeof input === 'object') {
    for (const [k, v] of Object.entries(input)) if (CATEGORY_KEYS.includes(k)) out[k] = !!v;
  }
  return out;
};

// === GET Profile ===
const getMerchantProfile = async (req, res) => {
  try {
    const { merchantId } = req.params;

    const merchant = await Merchant.findOne({
      $or: [{ merchantId }, { _id: merchantId }],
    }).lean();

    if (!merchant) {
      return res.status(404).json({ success: false, message: '找不到商家資料' });
    }

    const catObj = merchant.category && typeof merchant.category === 'object' ? merchant.category : {};
    const tagObj = merchant.tag && typeof merchant.tag === 'object' ? merchant.tag : {};
    const hasAnyTag = Object.values(tagObj).some(Boolean);

    // DB 內的 storeImag 期望是 "merchantId/Logo.jpg"
    const storeImag = merchant.storeImag || '';
    // 提供可直接用的公開 URL（假設 app.use(express.static('public')) 已存在）
    const publicUrl = storeImag ? `/images/${storeImag}` : '';

    const profileData = {
      merchantId: merchant.merchantId || String(merchant._id),
      name: merchant.name || '',
      email: merchant.email || '',
      phone: merchant.phone || '',
      storeName: merchant.storeName || '',
      storeAddress: merchant.storeAddress || '',
      storeImag,                     // ← 你的欄位名
      storeImage: publicUrl,         // ← 為了前端相容（舊程式可能讀這個）
      category: catObj,              // 布林物件
      ...(hasAnyTag ? { tag: tagObj } : {}), // 全 false 就不回傳
      created_at: merchant.created_at,
      Business: merchant.Business || {},
    };

    res.json({ success: true, message: '成功取得商家資料', data: profileData });
  } catch (error) {
    console.error('取得商家資料失敗:', error);
    res.status(500).json({ success: false, message: '伺服器內部錯誤' });
  }
};

// === PUT Profile（不更新 tag；category 為物件）===
const updateMerchantProfile = async (req, res) => {
  try {
    const { merchantId } = req.params;
    const body = req.body || {};

    // 必填
    if (!body.storeName || !String(body.storeName).trim()) {
      return res.status(400).json({ success: false, message: 'storeName 為必填欄位' });
    }
    if (!body.storeAddress || !String(body.storeAddress).trim()) {
      return res.status(400).json({ success: false, message: 'storeAddress 為必填欄位' });
    }
    // 驗證
    if (body.email && !/^\S+@\S+\.\S+$/.test(body.email)) {
      return res.status(400).json({ success: false, message: 'Email 格式不正確' });
    }
    if (body.phone && !/^[\d+()\s-]+$/.test(body.phone)) {
      return res.status(400).json({ success: false, message: '電話號碼格式不正確' });
    }

    const categoryObj = normalizeCategory(body.category);

    const update = {
      name: body.name?.trim() || '',
      email: body.email?.trim() || '',
      phone: body.phone?.trim() || '',
      storeName: String(body.storeName).trim(),
      storeAddress: String(body.storeAddress).trim(),
      ...(Object.keys(categoryObj).length ? { category: categoryObj } : {}),
      updated_at: new Date(),
    };

    const merchant = await Merchant.findOneAndUpdate(
      { $or: [{ merchantId }, { _id: merchantId }] },
      { $set: update },
      { new: true, runValidators: true }
    ).lean();

    if (!merchant) {
      return res.status(404).json({ success: false, message: '找不到商家資料' });
    }

    const storeImag = merchant.storeImag || '';
    const publicUrl = storeImag ? `/images/${storeImag}` : '';

    const profileData = {
      merchantId: merchant.merchantId || String(merchant._id),
      name: merchant.name || '',
      email: merchant.email || '',
      phone: merchant.phone || '',
      storeName: merchant.storeName || '',
      storeAddress: merchant.storeAddress || '',
      storeImag,
      storeImage: publicUrl,
      category: merchant.category && typeof merchant.category === 'object' ? merchant.category : {},
      updated_at: merchant.updated_at,
    };

    res.json({ success: true, message: '商家資料更新成功', data: profileData });
  } catch (error) {
    console.error('更新商家資料失敗:', error);
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map((e) => e.message);
      return res.status(422).json({ success: false, message: '資料驗證失敗', errors });
    }
    res.status(500).json({ success: false, message: '伺服器內部錯誤' });
  }
};

// === POST Logo（寫入 public/images/<merchantId>/Logo.<ext>；DB.storeImag = "<merchantId>/Logo.<ext>"）===
const uploadMerchantLogo = async (req, res) => {
  try {
    const { merchantId } = req.params;

    if (!req.file) {
      return res.status(400).json({ success: false, message: '請選擇要上傳的圖片' });
    }

    const uploadedFilename = path.basename(req.file.filename);      // e.g. Logo.jpg
    const dir = path.join(__dirname, '../public/images', merchantId);
    const storeImag = `${merchantId}/${uploadedFilename}`;          // ← 存進 DB 的相對路徑
    const publicUrl = `/images/${storeImag}`;                       // ← 前端可直接使用

    // 清理舊的 Logo.*（不同副檔名）
    try {
      const files = await fs.readdir(dir);
      await Promise.all(
        files
          .filter(f => /^Logo\.(jpg|jpeg|png|gif|webp)$/i.test(f) && f !== uploadedFilename)
          .map(f => fs.unlink(path.join(dir, f)).catch(() => {}))
      );
    } catch (_) {}

    const merchant = await Merchant.findOneAndUpdate(
      { $or: [{ merchantId }, { _id: merchantId }] },
      { $set: { storeImag, updated_at: new Date() } },
      { new: true }
    ).lean();

    if (!merchant) {
      await fs.unlink(path.join(dir, uploadedFilename)).catch(() => {});
      return res.status(404).json({ success: false, message: '找不到商家資料' });
    }

    res.json({
      success: true,
      message: 'Logo 上傳成功',
      data: { storeImag, imageUrl: publicUrl, filename: uploadedFilename }
    });
  } catch (error) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ success: false, message: '圖片大小不可超過 300KB' });
    }
    if (req.file) {
      const safeDir = path.join(__dirname, '../public/images', req.params.merchantId || '');
      await fs.unlink(path.join(safeDir, req.file.filename)).catch(() => {});
    }
    console.error('上傳 Logo 失敗:', error);
    res.status(500).json({ success: false, message: '上傳失敗' });
  }
};

// === DELETE Logo（刪除 Logo.* 並清 DB.storeImag）===
const deleteMerchantLogo = async (req, res) => {
  try {
    const { merchantId } = req.params;

    const merchant = await Merchant.findOne({ $or: [{ merchantId }, { _id: merchantId }] }).lean();
    if (!merchant) return res.status(404).json({ success: false, message: '找不到商家資料' });

    const dir = path.join(__dirname, '../public/images', merchantId);
    try {
      const files = await fs.readdir(dir);
      await Promise.all(
        files
          .filter(f => /^Logo\.(jpg|jpeg|png|gif|webp)$/i.test(f))
          .map(f => fs.unlink(path.join(dir, f)).catch(() => {}))
      );
    } catch (_) {}

    await Merchant.findOneAndUpdate(
      { $or: [{ merchantId }, { _id: merchantId }] },
      { $unset: { storeImag: 1 }, $set: { updated_at: new Date() } }
    );

    res.json({ success: true, message: '圖片刪除成功' });
  } catch (error) {
    console.error('刪除圖片失敗:', error);
    res.status(500).json({ success: false, message: '刪除失敗' });
  }
};

module.exports = {
  getMerchantProfile,
  updateMerchantProfile,
  uploadMerchantLogo: [upload.single('logo'), uploadMerchantLogo], // 路由端不用再掛 multer
  deleteMerchantLogo,
};
