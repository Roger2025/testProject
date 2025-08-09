<<<<<<< HEAD
const Merchant = require('../models/merchant/Todo_merchant');

// 取得商家的營業排程
const getMerchantSchedule = async (req, res) => {
  const { merchantId } = req.params;
  try {
    const merchant = await Merchant.findOne({ merchantId });
    if (!merchant) return res.status(404).json({ message: '找不到商家' });

    const schedule = merchant.Business.schedule || {};
    res.status(200).json({ success: true, data: schedule });
  } catch (err) {
    console.error('取得商家營業排程失敗:', err.message, err);
=======
// controllers/merchantScheduleController.js
const Merchant = require('../models/merchant/Todo_merchant');

// 取得商家的營業排程（回傳完整 Business，或若你要只回 schedule 就改一行）
const getMerchantSchedule = async (req, res) => {
  const { merchantId } = req.params;
  try {
    const merchant = await Merchant.findOne({ merchantId }).lean();
    if (!merchant) return res.status(404).json({ message: '找不到商家' });

    // 如果前端 slice 期望的是 { schedule, timezone, ... }，建議回傳整個 Business
    const business = merchant.Business || {};
    return res.status(200).json({ success: true, data: business });

    // 若你只想回 schedule，則改成：
    // return res.status(200).json({ success: true, data: business.schedule || {} });
  } catch (err) {
    console.error('取得商家營業排程失敗:', err);
>>>>>>> alan
    res.status(500).json({ message: '取得商家營業排程失敗' });
  }
};

<<<<<<< HEAD
// 更新商家的營業排程
const updateMerchantSchedule = async (req, res) => {
  const { merchantId } = req.params;
  const newSchedule = req.body.schedule;

  try {
    const merchant = await Merchant.findOne({ merchantId });
    if (!merchant) return res.status(404).json({ message: '找不到商家' });

    merchant.Business = {
    ...merchant.Business, // 保留其他 Business 下的資訊
    schedule: newSchedule,
    lastModified: new Date()
    };
    await merchant.save();
    console.log('收到的新 schedule：', newSchedule);
    res.status(200).json({ success: true, message: '營業排程更新成功', data: merchant.Business });
  } catch (err) {
    console.error('更新商家營業排程失敗:', err.message, err);
    res.status(500).json({ message: '更新商家營業排程失敗' });
=======
// 更新商家的營業排程（穩定版）
const updateMerchantSchedule = async (req, res) => {
  const { merchantId } = req.params;
  const { schedule, timezone = 'Asia/Taipei' } = req.body;

  try {
    // 1) 讀取當前資料（寫前快照）
    const before = await Merchant.findOne({ merchantId });
    if (!before) return res.status(404).json({ message: '找不到商家' });

    console.log('[update] req.body =', { schedule, timezone });
    console.log('[update] before.Business =', before.Business);

    // 2) 直接以 $set 更新（避免覆蓋掉 Business 其他欄位）
    const update = {
      'Business.schedule': schedule,
      'Business.timezone': timezone,
      'Business.lastModified': new Date(),
    };

    const result = await Merchant.updateOne({ merchantId }, { $set: update });
    console.log('[update] matched =', result.matchedCount, 'modified =', result.modifiedCount);

    // 3) 立即再查一次，取得最新狀態（寫後快照）
    const after = await Merchant.findOne({ merchantId });
    console.log('[update] after.Business =', after.Business);

    return res.status(200).json({
      success: true,
      message: '營業排程更新成功',
      data: after.Business,
    });
  } catch (err) {
    console.error('更新商家營業排程失敗:', err);
    return res.status(500).json({ message: '更新商家營業排程失敗' });
>>>>>>> alan
  }
};

// 檢查商家當天是否營業
const checkMerchantStatus = async (req, res) => {
  const { merchantId } = req.params;
  try {
<<<<<<< HEAD
    const merchant = await Merchant.findOne({ merchantId });
    if (!merchant) return res.status(404).json({ message: '找不到商家' });

    const schedule = merchant.Business.schedule || {};
    const today = new Date().toLocaleString('en-US', { weekday: 'long' }); // ex: "Monday"
    const todaySchedule = schedule[today.toLowerCase()];
=======
    const merchant = await Merchant.findOne({ merchantId }).lean();
    if (!merchant) return res.status(404).json({ message: '找不到商家' });

    const schedule = merchant.Business?.schedule || {};
    const today = new Date().toLocaleString('en-US', { weekday: 'long' }).toLowerCase();
    const todaySchedule = schedule[today];
>>>>>>> alan

    const isOpen = todaySchedule?.isOpen || false;
    res.status(200).json({ success: true, isOpen });
  } catch (err) {
<<<<<<< HEAD
    console.error('檢查商家營業狀態失敗:', err.message, err);
=======
    console.error('檢查商家營業狀態失敗:', err);
>>>>>>> alan
    res.status(500).json({ message: '檢查商家營業狀態失敗' });
  }
};

// 一週營業概況
const getWeeklyScheduleOverview = async (req, res) => {
  const { merchantId } = req.params;
  try {
<<<<<<< HEAD
    const merchant = await Merchant.findOne({ merchantId });
    if (!merchant) return res.status(404).json({ message: '找不到商家' });

    const schedule = merchant.Business.schedule || {};
    const overview = Object.entries(schedule).map(([day, info]) => ({
      day,
      isOpen: info?.isOpen || false,
      openTime: info?.openTime || null,
      closeTime: info?.closeTime || null
=======
    const merchant = await Merchant.findOne({ merchantId }).lean();
    if (!merchant) return res.status(404).json({ message: '找不到商家' });

    const schedule = merchant.Business?.schedule || {};
    const overview = Object.entries(schedule).map(([day, info]) => ({
      day,
      isOpen: !!info?.isOpen,
      openTime: info?.openTime || null,
      closeTime: info?.closeTime || null,
>>>>>>> alan
    }));

    res.status(200).json({ success: true, data: overview });
  } catch (err) {
    console.error('取得商家一週營業概況失敗:', err);
    res.status(500).json({ message: '取得商家一週營業概況失敗' });
  }
};

module.exports = {
  getMerchantSchedule,
  updateMerchantSchedule,
  checkMerchantStatus,
  getWeeklyScheduleOverview,
};