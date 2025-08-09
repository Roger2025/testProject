// src/features/merchant/storeStatus/merchantScheduleSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { merchantApi } from '../../../services/merchantApi';
import { getEffectiveMerchantId } from '../../../utils/getMerchantId';

// 工具：從 state 取 merchantId，取不到就用 fallback（僅開發模式）
const pickMerchantId = (state) => {
  const authId = state.merchantAuth?.merchant?.merchantId || null;
  return getEffectiveMerchantId(authId); // 會處理 devFlags.bypassAuth
};

// 取得營業排程（不帶參數 → thunk 自己抓 merchantId）
export const fetchMerchantSchedule = createAsyncThunk(
  'merchantSchedule/fetchSchedule',
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const merchantId = pickMerchantId(state);
      if (!merchantId) return rejectWithValue('缺少店家身份，請先登入');

      const res = await merchantApi.getSchedule(merchantId);
      return res.data?.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || '獲取營業排程失敗');
    }
  }
);

// 更新營業排程（只收 { schedule, timezone }，merchantId 由 thunk 取得）
export const updateMerchantSchedule = createAsyncThunk(
  'merchantSchedule/updateSchedule',
  async ({ schedule, timezone = 'Asia/Taipei' }, { getState, rejectWithValue, dispatch }) => {
    try {
      const state = getState();
      const authId = state.merchantAuth?.merchant?.merchantId || null;
      const merchantId = getEffectiveMerchantId(authId);
      if (!merchantId) return rejectWithValue('缺少店家身份，請先登入');

      const payload = { schedule, timezone };
      await merchantApi.updateSchedule(merchantId, payload);

      // 立刻重取，確保前端狀態和 DB 一致
      const res = await merchantApi.getSchedule(merchantId);
      return res.data?.data; // 讓 fulfilled 直接拿新資料
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || '更新營業排程失敗');
    }
  }
);

const defaultWeek = {
  monday:    { isOpen: false, openTime: '06:00', closeTime: '14:00' },
  tuesday:   { isOpen: false, openTime: '06:00', closeTime: '14:00' },
  wednesday: { isOpen: false, openTime: '06:00', closeTime: '14:00' },
  thursday:  { isOpen: false, openTime: '06:00', closeTime: '14:00' },
  friday:    { isOpen: false, openTime: '06:00', closeTime: '14:00' },
  saturday:  { isOpen: false, openTime: '06:00', closeTime: '14:00' },
  sunday:    { isOpen: false, openTime: '06:00', closeTime: '14:00' },
};

const initialState = {
  schedule: defaultWeek,    // 純週排程
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
      state.schedule = defaultWeek;
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
        const data = action.payload || {};
        state.schedule = data.schedule || defaultWeek;
        state.timezone = data.timezone || 'Asia/Taipei';
        state.lastModified = data.lastModified || null;
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
        state.saving = false;
        // action.payload === merchant.Business
        const business = action.payload;
        if (business?.schedule) state.schedule = business.schedule;
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