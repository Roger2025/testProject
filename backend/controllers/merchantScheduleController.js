const MerchantSchedule = require('../models/merchant/merchantSchedule');
const mongoose = require('mongoose');

// 獲取商家營業排程
const getMerchantSchedule = async (req, res) => {
  try {
    const { merchantId } = req.params;

    // 驗證 merchantId 格式
    if (!mongoose.Types.ObjectId.isValid(merchantId)) {
      return res.status(400).json({
        success: false,
        message: '無效的商家ID格式'
      });
    }

    // 查找或創建排程
    const schedule = await MerchantSchedule.findOrCreateByMerchantId(merchantId);

    res.status(200).json({
      success: true,
      message: '獲取營業排程成功',
      schedule: schedule.schedule,
      timezone: schedule.timezone,
      lastModified: schedule.lastModified
    });

  } catch (error) {
    console.error('獲取營業排程錯誤:', error);
    res.status(500).json({
      success: false,
      message: '伺服器內部錯誤',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// 更新商家營業排程
const updateMerchantSchedule = async (req, res) => {
  try {
    const { merchantId } = req.params;
    const { schedule, timezone } = req.body;

    // 驗證 merchantId 格式
    if (!mongoose.Types.ObjectId.isValid(merchantId)) {
      return res.status(400).json({
        success: false,
        message: '無效的商家ID格式'
      });
    }

    // 驗證必要欄位
    if (!schedule) {
      return res.status(400).json({
        success: false,
        message: '營業排程資料不能為空'
      });
    }

    // 驗證排程格式
    const dayNames = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;

    for (const day of dayNames) {
      if (schedule[day]) {
        const daySchedule = schedule[day];
        
        // 驗證時間格式
        if (daySchedule.openTime && !timeRegex.test(daySchedule.openTime)) {
          return res.status(400).json({
            success: false,
            message: `${day} 開始時間格式錯誤，請使用 HH:MM 格式`
          });
        }
        
        if (daySchedule.closeTime && !timeRegex.test(daySchedule.closeTime)) {
          return res.status(400).json({
            success: false,
            message: `${day} 結束時間格式錯誤，請使用 HH:MM 格式`
          });
        }

        // 驗證結束時間必須晚於開始時間
        if (daySchedule.isOpen && daySchedule.openTime && daySchedule.closeTime) {
          if (daySchedule.openTime >= daySchedule.closeTime) {
            return res.status(400).json({
              success: false,
              message: `${day} 結束時間必須晚於開始時間`
            });
          }
        }
      }
    }

    // 查找現有排程或創建新的
    let merchantSchedule = await MerchantSchedule.findOne({ merchantId });
    
    if (!merchantSchedule) {
      merchantSchedule = new MerchantSchedule({ merchantId });
    }

    // 更新排程資料
    merchantSchedule.schedule = schedule;
    if (timezone) {
      merchantSchedule.timezone = timezone;
    }

    await merchantSchedule.save();

    res.status(200).json({
      success: true,
      message: '營業排程更新成功',
      schedule: merchantSchedule.schedule,
      timezone: merchantSchedule.timezone,
      lastModified: merchantSchedule.lastModified
    });

  } catch (error) {
    console.error('更新營業排程錯誤:', error);
    
    // 處理 MongoDB 驗證錯誤
    if (error.name === 'ValidationError') {
      const errorMessages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: '資料驗證失敗',
        errors: errorMessages
      });
    }

    res.status(500).json({
      success: false,
      message: '伺服器內部錯誤',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// 檢查商家當前營業狀態
const checkMerchantStatus = async (req, res) => {
  try {
    const { merchantId } = req.params;

    // 驗證 merchantId 格式
    if (!mongoose.Types.ObjectId.isValid(merchantId)) {
      return res.status(400).json({
        success: false,
        message: '無效的商家ID格式'
      });
    }

    const schedule = await MerchantSchedule.findOne({ merchantId });
    
    if (!schedule) {
      return res.status(200).json({
        success: true,
        isOpen: false,
        message: '尚未設定營業時間'
      });
    }

    const isCurrentlyOpen = schedule.isCurrentlyOpen();
    const now = new Date();
    const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const currentDay = dayNames[now.getDay()];
    const businessHours = schedule.getBusinessHours(currentDay);

    res.status(200).json({
      success: true,
      isOpen: isCurrentlyOpen,
      currentDay,
      businessHours,
      currentTime: now.toTimeString().slice(0, 5)
    });

  } catch (error) {
    console.error('檢查營業狀態錯誤:', error);
    res.status(500).json({
      success: false,
      message: '伺服器內部錯誤',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// 獲取商家一週營業概況
const getWeeklyScheduleOverview = async (req, res) => {
  try {
    const { merchantId } = req.params;

    // 驗證 merchantId 格式
    if (!mongoose.Types.ObjectId.isValid(merchantId)) {
      return res.status(400).json({
        success: false,
        message: '無效的商家ID格式'
      });
    }

    const schedule = await MerchantSchedule.findOne({ merchantId });
    
    if (!schedule) {
      return res.status(200).json({
        success: true,
        overview: {
          totalOpenDays: 0,
          openDays: [],
          closedDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
        }
      });
    }

    const dayNames = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    const openDays = [];
    const closedDays = [];

    dayNames.forEach(day => {
      if (schedule.isOpenOnDay(day)) {
        openDays.push({
          day,
          ...schedule.getBusinessHours(day)
        });
      } else {
        closedDays.push(day);
      }
    });

    res.status(200).json({
      success: true,
      overview: {
        totalOpenDays: openDays.length,
        openDays,
        closedDays
      }
    });

  } catch (error) {
    console.error('獲取營業概況錯誤:', error);
    res.status(500).json({
      success: false,
      message: '伺服器內部錯誤',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

module.exports = {
  getMerchantSchedule,
  updateMerchantSchedule,
  checkMerchantStatus,
  getWeeklyScheduleOverview
};