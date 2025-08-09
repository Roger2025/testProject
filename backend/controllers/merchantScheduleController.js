const mongoose = require('mongoose');
const Merchant = require('../models/Register_Schema/merchant');

// 內用：同時支援 merchantId 是「字串」或「ObjectId」的查法（相容舊資料）
function buildMerchantQuery(rawId) {
  const idStr = String(rawId || '');
  const conds = [{ merchantId: idStr }];
  if (/^[a-f\d]{24}$/i.test(idStr)) {
    conds.push({ merchantId: new mongoose.Types.ObjectId(idStr) });
  }
  return { $or: conds };
}

// 取得商家的營業排程
const getMerchantSchedule = async (req, res) => {
  const { merchantId } = req.params;
  try {
    const merchant = await Merchant.findOne(buildMerchantQuery(merchantId)).lean();
    if (!merchant) return res.status(404).json({ message: '找不到商家' });

    // 這裡原本直接取 merchant.Business.schedule 會爆：Cannot read properties of undefined
    const schedule = merchant.Business?.schedule || {};
    return res.status(200).json({ success: true, data: schedule });
  } catch (err) {
    console.error('取得商家營業排程失敗:', err.message, err);
    return res.status(500).json({ message: '取得商家營業排程失敗' });
  }
};

// 更新商家的營業排程
const updateMerchantSchedule = async (req, res) => {
  const { merchantId } = req.params;
  const newSchedule = req.body.schedule;

  try {
    const merchant = await Merchant.findOne(buildMerchantQuery(merchantId));
    if (!merchant) return res.status(404).json({ message: '找不到商家' });

    // ⬇⬇ 確保 Business 存在再寫入，避免 undefined.schedule
    merchant.Business = {
      ...(merchant.Business || {}),
      schedule: newSchedule,
      lastModified: new Date(),
    };

    await merchant.save();
    console.log('收到的新 schedule：', newSchedule);
    return res.status(200).json({ success: true, message: '營業排程更新成功', data: merchant.Business });
  } catch (err) {
    console.error('更新商家營業排程失敗:', err.message, err);
    return res.status(500).json({ message: '更新商家營業排程失敗' });
  }
};

// 檢查商家當天是否營業
const checkMerchantStatus = async (req, res) => {
  const { merchantId } = req.params;
  try {
    const merchant = await Merchant.findOne(buildMerchantQuery(merchantId)).lean();
    if (!merchant) return res.status(404).json({ message: '找不到商家' });

    const schedule = merchant.Business?.schedule || {};
    const today = new Date().toLocaleString('en-US', { weekday: 'long' }); // ex: "Monday"
    const todaySchedule = schedule[today.toLowerCase()];
    const isOpen = todaySchedule?.isOpen || false;

    return res.status(200).json({ success: true, isOpen });
  } catch (err) {
    console.error('檢查商家營業狀態失敗:', err.message, err);
    return res.status(500).json({ message: '檢查商家營業狀態失敗' });
  }
};

// 一週營業概況
const getWeeklyScheduleOverview = async (req, res) => {
  const { merchantId } = req.params;
  try {
    const merchant = await Merchant.findOne(buildMerchantQuery(merchantId)).lean();
    if (!merchant) return res.status(404).json({ message: '找不到商家' });

    const schedule = merchant.Business?.schedule || {};
    const overview = Object.entries(schedule).map(([day, info]) => ({
      day,
      isOpen: info?.isOpen || false,
      openTime: info?.openTime || null,
      closeTime: info?.closeTime || null,
    }));

    return res.status(200).json({ success: true, data: overview });
  } catch (err) {
    console.error('取得商家一週營業概況失敗:', err);
    return res.status(500).json({ message: '取得商家一週營業概況失敗' });
  }
};

module.exports = {
  getMerchantSchedule,
  updateMerchantSchedule,
  checkMerchantStatus,
  getWeeklyScheduleOverview,
};
