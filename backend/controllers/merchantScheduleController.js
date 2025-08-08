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
    res.status(500).json({ message: '取得商家營業排程失敗' });
  }
};

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
  }
};

// 檢查商家當天是否營業
const checkMerchantStatus = async (req, res) => {
  const { merchantId } = req.params;
  try {
    const merchant = await Merchant.findOne({ merchantId });
    if (!merchant) return res.status(404).json({ message: '找不到商家' });

    const schedule = merchant.Business.schedule || {};
    const today = new Date().toLocaleString('en-US', { weekday: 'long' }); // ex: "Monday"
    const todaySchedule = schedule[today.toLowerCase()];

    const isOpen = todaySchedule?.isOpen || false;
    res.status(200).json({ success: true, isOpen });
  } catch (err) {
    console.error('檢查商家營業狀態失敗:', err.message, err);
    res.status(500).json({ message: '檢查商家營業狀態失敗' });
  }
};

// 一週營業概況
const getWeeklyScheduleOverview = async (req, res) => {
  const { merchantId } = req.params;
  try {
    const merchant = await Merchant.findOne({ merchantId });
    if (!merchant) return res.status(404).json({ message: '找不到商家' });

    const schedule = merchant.Business.schedule || {};
    const overview = Object.entries(schedule).map(([day, info]) => ({
      day,
      isOpen: info?.isOpen || false,
      openTime: info?.openTime || null,
      closeTime: info?.closeTime || null
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
  getWeeklyScheduleOverview
};