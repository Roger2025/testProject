const mongoose = require('mongoose');
const TIME_RE = /^([01]\d|2[0-3]):([0-5]\d)$/;

// 單日排程 Schema
const dayScheduleSchema = new mongoose.Schema({
  isOpen: {
    type: Boolean,
    default: false
  },
  openTime: {
    type: String,
    default: '06:00',
    validate: {
      validator: function (v) {
        // this 指向當天的 subdocument
        if (!this.isOpen) return v === '' || v == null;   // 休息日允許空值
        return TIME_RE.test(v);                           // 營業日需 HH:MM
      },
      message: '時間格式必須為 HH:MM'
    }
  },
  closeTime: {
    type: String,
    default: '14:00',
    validate: {
      validator: function (v) {
        if (!this.isOpen) return v === '' || v == null;   // 休息日允許空值
        return TIME_RE.test(v);                           // 營業日需 HH:MM
      },
      message: '時間格式必須為 HH:MM'
    }
  }
}, { _id: false });

// 營業排程 Schema
const merchantScheduleSchema = new mongoose.Schema({
  merchantId: {
    type: String,
    required: false, // 強制驗證一定要有值
    unique: true,
    ref: 'Merchant'
  },
  schedule: {
    monday: {
      type: dayScheduleSchema,
      default: () => ({})
    },
    tuesday: {
      type: dayScheduleSchema,
      default: () => ({})
    },
    wednesday: {
      type: dayScheduleSchema,
      default: () => ({})
    },
    thursday: {
      type: dayScheduleSchema,
      default: () => ({})
    },
    friday: {
      type: dayScheduleSchema,
      default: () => ({})
    },
    saturday: {
      type: dayScheduleSchema,
      default: () => ({})
    },
    sunday: {
      type: dayScheduleSchema,
      default: () => ({})
    }
  },
  timezone: {
    type: String,
    default: 'Asia/Taipei'
  },
  lastModified: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
}, { _id: false });

// 更新時自動設定 lastModified
merchantScheduleSchema.pre('save', function(next) {
  this.lastModified = new Date();
  next();
});

// 靜態方法：根據 merchantId 查找或創建排程
merchantScheduleSchema.statics.findOrCreateByMerchantId = async function(merchantId) {
  let schedule = await this.findOne({ merchantId });
  
  if (!schedule) {
    schedule = new this({ merchantId });
    await schedule.save();
  }
  
  return schedule;
};

// 實例方法：檢查指定日期是否營業
merchantScheduleSchema.methods.isOpenOnDay = function(dayName) {
  const daySchedule = this.schedule[dayName];
  return daySchedule && daySchedule.isOpen;
};

// 實例方法：獲取指定日期的營業時間
merchantScheduleSchema.methods.getBusinessHours = function(dayName) {
  const daySchedule = this.schedule[dayName];
  if (!daySchedule || !daySchedule.isOpen) {
    return null;
  }
  
  return {
    openTime: daySchedule.openTime,
    closeTime: daySchedule.closeTime
  };
};

// 實例方法：檢查當前時間是否在營業時間內
merchantScheduleSchema.methods.isCurrentlyOpen = function() {
  const now = new Date();
  const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const currentDay = dayNames[now.getDay()];
  
  const daySchedule = this.schedule[currentDay];
  if (!daySchedule || !daySchedule.isOpen) {
    return false;
  }
  
  const currentTime = now.toTimeString().slice(0, 5); // HH:MM 格式
  return currentTime >= daySchedule.openTime && currentTime <= daySchedule.closeTime;
};

// 索引設定
merchantScheduleSchema.index({ merchantId: 1 });
merchantScheduleSchema.index({ 'schedule.monday.isOpen': 1 });
merchantScheduleSchema.index({ 'schedule.tuesday.isOpen': 1 });
merchantScheduleSchema.index({ 'schedule.wednesday.isOpen': 1 });
merchantScheduleSchema.index({ 'schedule.thursday.isOpen': 1 });
merchantScheduleSchema.index({ 'schedule.friday.isOpen': 1 });
merchantScheduleSchema.index({ 'schedule.saturday.isOpen': 1 });
merchantScheduleSchema.index({ 'schedule.sunday.isOpen': 1 });

//這樣會在DB建立一個MerchantSchedule資料表
// module.exports = mongoose.model('MerchantSchedule', merchantScheduleSchema);

//只exportschema給Todo_merchant新增欄位資料用
module.exports = merchantScheduleSchema;