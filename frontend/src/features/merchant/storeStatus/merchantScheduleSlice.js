import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { merchantApi } from '../../../services/merchantApi';

// 獲取營業排程
export const fetchMerchantSchedule = createAsyncThunk(
  'merchantSchedule/fetchSchedule',
  async (merchantId, { rejectWithValue }) => {
    try {
      const response = await merchantApi.getSchedule(merchantId);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || '獲取營業排程失敗'
      );
    }
  }
);

// 更新營業排程
export const updateMerchantSchedule = createAsyncThunk(
  'merchantSchedule/updateSchedule',
  async ({ merchantId, scheduleData }, { rejectWithValue }) => {
    try {
      const response = await merchantApi.updateSchedule(merchantId, scheduleData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || '更新營業排程失敗'
      );
    }
  }
);

const initialState = {
  schedule: {
    monday: { isOpen: false, openTime: '06:00', closeTime: '14:00' },
    tuesday: { isOpen: false, openTime: '06:00', closeTime: '14:00' },
    wednesday: { isOpen: false, openTime: '06:00', closeTime: '14:00' },
    thursday: { isOpen: false, openTime: '06:00', closeTime: '14:00' },
    friday: { isOpen: false, openTime: '06:00', closeTime: '14:00' },
    saturday: { isOpen: false, openTime: '06:00', closeTime: '14:00' },
    sunday: { isOpen: false, openTime: '06:00', closeTime: '14:00' }
  },
  loading: false,
  error: null,
  updateLoading: false
};

const merchantScheduleSlice = createSlice({
  name: 'merchantSchedule',
  initialState,
  reducers: {
    // 清除錯誤訊息
    clearError: (state) => {
      state.error = null;
    },
    // 更新單日排程
    updateDaySchedule: (state, action) => {
      const { day, scheduleData } = action.payload;
      state.schedule[day] = { ...state.schedule[day], ...scheduleData };
    },
    // 批量設定營業時間（例如：全週設定相同時間）
    setBulkSchedule: (state, action) => {
      const { days, scheduleData } = action.payload;
      days.forEach(day => {
        state.schedule[day] = { ...state.schedule[day], ...scheduleData };
      });
    },
    // 重設排程
    resetSchedule: (state) => {
      state.schedule = initialState.schedule;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // 獲取營業排程
      .addCase(fetchMerchantSchedule.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMerchantSchedule.fulfilled, (state, action) => {
        state.loading = false;
        state.schedule = action.payload.schedule || initialState.schedule;
      })
      .addCase(fetchMerchantSchedule.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // 更新營業排程
      .addCase(updateMerchantSchedule.pending, (state) => {
        state.updateLoading = true;
        state.error = null;
      })
      .addCase(updateMerchantSchedule.fulfilled, (state, action) => {
        state.updateLoading = false;
        state.schedule = action.payload.schedule;
      })
      .addCase(updateMerchantSchedule.rejected, (state, action) => {
        state.updateLoading = false;
        state.error = action.payload;
      });
  }
});

export const { 
  clearError, 
  updateDaySchedule, 
  setBulkSchedule, 
  resetSchedule 
} = merchantScheduleSlice.actions;

export default merchantScheduleSlice.reducer;