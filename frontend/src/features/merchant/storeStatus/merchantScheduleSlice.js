// src/features/merchant/storeStatus/merchantScheduleSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { merchantApi } from '../../../services/merchantApi';
// import { getEffectiveMerchantId } from '../../../utils/getMerchantId';

// 預設單日排程
const DEFAULT_DAY = { isOpen: false, openTime: '', closeTime: '' };

const DEFAULT_WEEK = {
  monday: { ...DEFAULT_DAY },
  tuesday:   { ...DEFAULT_DAY },
  wednesday: { ...DEFAULT_DAY },
  thursday:  { ...DEFAULT_DAY },
  friday:    { ...DEFAULT_DAY },
  saturday:  { ...DEFAULT_DAY },
  sunday:    { ...DEFAULT_DAY },
};

// 工具：將 API 回傳的排程格式化為預設結構
const normalizeSchedule = (src = {}) => {
  const alias = { mon: 'monday', tue: 'tuesday', wed: 'wednesday', thu: 'thursday', fri: 'friday', sat: 'saturday', sun: 'sunday' };
  const out = { ...DEFAULT_WEEK };
  Object.entries(src || {}).forEach(([k, v]) => {
    const key = (k || '').toLowerCase();
    const full = out[key] ? key : alias[key];
    if (full) out[full] = { ...DEFAULT_DAY, ...(v || {}) };
  });
  return out;
};

// 工具：從 state 取 merchantId，取不到就用 fallback（僅開發模式）
// const pickMerchantId = (state) => {
//     const authId =
//     state.merchantAuth?.user?.merchantId ??
//     state.auth?.user?.merchantId ?? null;
//   return getEffectiveMerchantId(authId); // 會處理 devFlags.bypassAuth
// };

// 取得營業排程（不帶參數 → thunk 自己抓 merchantId）
export const fetchMerchantSchedule = createAsyncThunk(
  'merchantSchedule/fetchSchedule',
  async (_, { rejectWithValue }) => {
    try {
      const res = await merchantApi.getSchedule();
      return res.data?.data;
    } catch (error) {
      return rejectWithValue(merchantApi.handleApiError(error) || '獲取營業排程失敗');
    }
  }
);

// 更新營業排程（只收 { schedule, timezone }，merchantId 由 thunk 取得）
export const updateMerchantSchedule = createAsyncThunk(
  'merchantSchedule/updateSchedule',
  async ({ schedule, timezone = 'Asia/Taipei' }, { rejectWithValue }) => {
    try {
      
      await merchantApi.updateSchedule({ schedule, timezone });
      // 立刻重取，確保前端狀態和 DB 一致
      const res = await merchantApi.getSchedule();
      return res.data?.data; // 讓 fulfilled 直接拿新資料
    } catch (error) {
      return rejectWithValue(merchantApi.handleApiError(error) || '更新營業排程失敗');
    }
  }
);

// const defaultWeek = {
//   monday:    { isOpen: false, openTime: '06:00', closeTime: '14:00' },
//   tuesday:   { isOpen: false, openTime: '06:00', closeTime: '14:00' },
//   wednesday: { isOpen: false, openTime: '06:00', closeTime: '14:00' },
//   thursday:  { isOpen: false, openTime: '06:00', closeTime: '14:00' },
//   friday:    { isOpen: false, openTime: '06:00', closeTime: '14:00' },
//   saturday:  { isOpen: false, openTime: '06:00', closeTime: '14:00' },
//   sunday:    { isOpen: false, openTime: '06:00', closeTime: '14:00' },
// };

const initialState = {
  schedule: DEFAULT_WEEK,    // 純週排程（monday..sunday）
  timezone: 'Asia/Taipei',  // 也存下時區
  lastModified: null,
  loading: false,           // 讀取中
  saving: false,            // 更新中
  error: null,
};

const merchantScheduleSlice = createSlice({
  name: 'merchantSchedule',
  initialState,
  reducers: {
    clearError(state) {
      state.error = null;
    },
    // 單日更新（本地）
    updateDaySchedule(state, action) {
      const { day, scheduleData } = action.payload;
      if (!state.schedule[day]) state.schedule[day] = { ...DEFAULT_DAY };
      state.schedule[day] = { ...state.schedule[day], ...scheduleData };
    },
    // 批量設定（本地）
    setBulkSchedule(state, action) {
      const { days, scheduleData } = action.payload;
      days.forEach((day) => {
        state.schedule[day] = { ...state.schedule[day], ...scheduleData };
      });
    },
    // 重設（回預設週）
    resetSchedule(state) {
      state.schedule = DEFAULT_WEEK;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetch
      .addCase(fetchMerchantSchedule.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMerchantSchedule.fulfilled, (state, action) => {
        state.loading = false;
        const payload = action.payload || {};
        const raw = payload.schedule || payload.business?.schedule || payload; // 依你後端實際結構擇一
        state.schedule = normalizeSchedule(raw);
        state.timezone = payload.timezone || 'Asia/Taipei';
        state.lastModified = payload.lastModified ?? null;
        state.loading = false;
        state.error = null;
      })
      .addCase(fetchMerchantSchedule.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || '讀取失敗';
      })

      // update
      .addCase(updateMerchantSchedule.pending, (state) => {
        state.saving = true;
        state.error = null;
      })
      .addCase(updateMerchantSchedule.fulfilled, (state, action) => {
        //舊的寫法當備份
        // state.saving = false;
        // // action.payload === merchant.Business
        // const business = action.payload;
        // if (business?.schedule) state.schedule = business.schedule;

        const payload = action.payload || {};
        const raw = payload.schedule || payload.business?.schedule || payload;
        state.schedule = normalizeSchedule(raw);
        state.timezone = payload.timezone || state.timezone;
        state.lastModified = payload.lastModified ?? state.lastModified;
        state.saving = false;
        state.error = null;
      })
      .addCase(updateMerchantSchedule.rejected, (state, action) => {
        state.saving = false;
        state.error = action.payload || '更新失敗';
      });
  },
});

export const {
  clearError,
  updateDaySchedule,
  setBulkSchedule,
  resetSchedule,
} = merchantScheduleSlice.actions;

export default merchantScheduleSlice.reducer;

// 小幫手 selectors（可選）
export const selectSchedule        = (s) => s.merchantSchedule.schedule;
export const selectTimezone        = (s) => s.merchantSchedule.timezone;
export const selectScheduleLoading = (s) => s.merchantSchedule.loading;
export const selectScheduleSaving  = (s) => s.merchantSchedule.saving;
export const selectScheduleError   = (s) => s.merchantSchedule.error;