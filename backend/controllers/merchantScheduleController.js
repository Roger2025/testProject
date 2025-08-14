// controllers/merchantScheduleController.js
const mongoose = require('mongoose');
// 依你的專案路徑
const Merchant = require('../models/merchant/Todo_merchant');

/** --------------------------
 * Helpers: 週預設 & 正規化
 * ------------------------- */
// 以前端為準：使用 monday ~ sunday
const EMPTY_DAY = { isOpen: false, openTime: '', closeTime: '' };
const WEEK_KEYS = ['monday','tuesday','wednesday','thursday','friday','saturday','sunday'];
const EMPTY_WEEK = WEEK_KEYS.reduce((acc, k) => ({ ...acc, [k]: { ...EMPTY_DAY } }), {});
const TIME_RE = /^([01]\d|2[0-3]):[0-5]\d$/;

// 允許接收縮寫（mon/tue/...）或完整（monday/...），一律轉成完整鍵
const ALIASES = {
  mon: 'monday', tue: 'tuesday', wed: 'wednesday',
  thu: 'thursday', fri: 'friday', sat: 'saturday', sun: 'sunday',
};

const normalizeWeek = (src = {}) => {
  // 先把縮寫鍵轉為完整鍵
  const expanded = Object.entries(src).reduce((acc, [k, v]) => {
    const key = (k || '').toString().toLowerCase();
    const full = WEEK_KEYS.includes(key) ? key : (ALIASES[key] || key);
    acc[full] = v || {};
    return acc;
  }, {});
  // 填滿 7 天並補齊欄位
  const out = {};
  WEEK_KEYS.forEach((k) => {
    const day = expanded[k] || {};
    out[k] = {
      isOpen: !!day.isOpen,
      openTime: typeof day.openTime === 'string' ? day.openTime : '',
      closeTime: typeof day.closeTime === 'string' ? day.closeTime : '',
    };
  });
  return out;
};

function validateWeekForOpenDays(week) {
  const bad = [];
  for (const [day, d] of Object.entries(week)) {
    if (!d?.isOpen) continue;
    const open = (d.openTime || '').trim();
    const close = (d.closeTime || '').trim();
    if (!TIME_RE.test(open) || !TIME_RE.test(close)) {
      bad.push(`${day}: 時間需為 HH:MM`);
      continue;
    }
    const toMin = (t) => {
      const [h, m] = t.split(':').map(Number);
      return h * 60 + m;
    };
    if (toMin(open) >= toMin(close)) {
      bad.push(`${day}: 結束時間需晚於開始時間`);
    }
  }
  return bad;
}

/** --------------------------
 * Helpers: 查詢條件（相容舊資料）
 * ------------------------- */
function buildMerchantQuery(rawId) {
  const idStr = String(rawId || '');
  const conds = [{ merchantId: idStr }];
  if (/^[a-f\d]{24}$/i.test(idStr)) conds.push({ merchantId: new mongoose.Types.ObjectId(idStr) });
  return { $or: conds };
}

/** --------------------------
 * 取得商家營業排程
 * GET /api/merchant/schedule/:merchantId
 * 回傳形狀：{ success, data: { schedule, timezone, lastModified } }
 * ------------------------- */
const getMerchantSchedule = async (req, res) => {
  const { merchantId } = req.params;
  try {
    const merchant = await Merchant.findOne(buildMerchantQuery(merchantId)).lean();
    if (!merchant) return res.status(404).json({ message: '找不到商家' });

    const biz = merchant.Business || {};
    const schedule = normalizeWeek(biz.schedule || {});
    const timezone = biz.timezone || 'Asia/Taipei';
    const lastModified = biz.lastModified ?? null;

    return res.status(200).json({
      success: true,
      data: { schedule, timezone, lastModified },
    });
  } catch (err) {
    console.error('取得商家營業排程失敗:', err);
    return res.status(500).json({ message: '取得商家營業排程失敗' });
  }
};

/** --------------------------
 * 更新商家營業排程
 * PUT /api/merchant/schedule/:merchantId
 * Body: { schedule, timezone? }
 * 回傳形狀：{ success, message, data: { schedule, timezone, lastModified } }
 * ------------------------- */
const updateMerchantSchedule = async (req, res) => {
  const { merchantId } = req.params;
  const { schedule: rawSchedule = {}, timezone } = req.body || {};

  try {
    const doc = await Merchant.findOne(buildMerchantQuery(merchantId));
    if (!doc) return res.status(404).json({ message: '找不到商家' });

    const normalized = normalizeWeek(rawSchedule);
    const problems = validateWeekForOpenDays(normalized);
    if (problems.length) {
      return res.status(400).json({ message: `資料驗證失敗：${problems.join('；')}` });
    }

    const prevBiz = doc.Business || {};
    const nextBiz = {
      ...prevBiz,
      schedule: normalized,
      timezone: timezone || prevBiz.timezone || 'Asia/Taipei',
      lastModified: new Date(),
    };

    doc.Business = nextBiz;
    await doc.save();

    return res.status(200).json({
      success: true,
      message: '營業排程更新成功',
      data: {
        schedule: nextBiz.schedule,
        timezone: nextBiz.timezone,
        lastModified: nextBiz.lastModified,
      },
    });
  } catch (err) {
    console.error('更新商家營業排程失敗:', err);
    return res.status(500).json({ message: '更新商家營業排程失敗' });
  }
};

/** --------------------------
 * 檢查商家當天是否營業
 * GET /api/merchant/schedule/:merchantId/status
 * 回傳形狀：{ success, isOpen }
 * ------------------------- */
const checkMerchantStatus = async (req, res) => {
  const { merchantId } = req.params;
  try {
    const merchant = await Merchant.findOne(buildMerchantQuery(merchantId)).lean();
    if (!merchant) return res.status(404).json({ message: '找不到商家' });

    const schedule = normalizeWeek(merchant.Business?.schedule || {});
    // en-US weekday: 'monday'...'sunday'
    const today = new Date().toLocaleString('en-US', { weekday: 'long' }).toLowerCase();
    const todaySchedule = schedule[today];

    const isOpen = !!todaySchedule?.isOpen;
    return res.status(200).json({ success: true, isOpen });
  } catch (err) {
    console.error('檢查商家營業狀態失敗:', err);
    return res.status(500).json({ message: '檢查商家營業狀態失敗' });
  }
};

/** --------------------------
 * 取得一週營業概況
 * GET /api/merchant/schedule/:merchantId/overview
 * 回傳形狀：{ success, data: Array<{ day,isOpen,openTime,closeTime }> }
 * ------------------------- */
const getWeeklyScheduleOverview = async (req, res) => {
  const { merchantId } = req.params;
  try {
    const merchant = await Merchant.findOne(buildMerchantQuery(merchantId)).lean();
    if (!merchant) return res.status(404).json({ message: '找不到商家' });

    const schedule = normalizeWeek(merchant.Business?.schedule || {});
    const overview = WEEK_KEYS.map((day) => ({
      day,
      isOpen: !!schedule[day].isOpen,
      openTime: schedule[day].openTime || null,
      closeTime: schedule[day].closeTime || null,
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