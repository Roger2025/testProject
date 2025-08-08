// features/merchant/orders/merchantOrdersSlice.js

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import merchantApi from '../../../services/merchantApi';

// === Thunks ===

// 取得今日訂單
export const fetchTodayOrders = createAsyncThunk(
  'merchantOrders/fetchTodayOrders',
  async (merchantId, { rejectWithValue }) => {
    try {
      const response = await merchantApi.getTodayOrders(merchantId);
      return response.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || '載入今日訂單失敗');
    }
  }
);

// 更新訂單狀態
export const updateOrderStatus = createAsyncThunk(
  'merchantOrders/updateOrderStatus',
  async ({ orderId, status, merchantId }, { rejectWithValue }) => {
    try {
      const response = await merchantApi.updateOrderStatus(orderId, status, merchantId);

      return {
        orderId,
        status,
        updatedOrder: response.data.data, // 將後端回傳的訂單內容傳回來
      };
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || '更新訂單狀態失敗');
    }
  }
);

// 取得今日統計
export const fetchTodayStats = createAsyncThunk(
  'merchantOrders/fetchTodayStats',
  async (merchantId, { rejectWithValue }) => {
    try {
      const response = await merchantApi.getOrderStats(merchantId);
      return response.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || '載入統計資料失敗');
    }
  }
);

// === Slice ===

const merchantOrdersSlice = createSlice({
  name: 'merchantOrders',
  initialState: {
    orders: [],
    todayStats: {
      totalOrders: 0,
      totalAmount: 0,
    },
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    // 今日訂單
    builder
      .addCase(fetchTodayOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTodayOrders.fulfilled, (state, action) => {
        state.orders = action.payload;
        state.loading = false;
      })
      .addCase(fetchTodayOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // 更新訂單狀態
    builder
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        const { orderId, updatedOrder } = action.payload;

        const index = state.orders.findIndex(order => order.order_id === orderId);
        if (index !== -1) {
          state.orders[index] = updatedOrder; // 用新的資料覆蓋舊的
        }

        state.error = null;
      })

      .addCase(updateOrderStatus.rejected, (state, action) => {
        state.error = action.payload;
      });

    // 今日統計
    builder
      .addCase(fetchTodayStats.fulfilled, (state, action) => {
        state.todayStats = action.payload;
      })
      .addCase(fetchTodayStats.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

// === Selectors ===

export const selectOrders = (state) => state.merchantOrders.orders;
export const selectTodayStats = (state) => state.merchantOrders.todayStats;
export const selectOrdersLoading = (state) => state.merchantOrders.loading;
export const selectOrdersError = (state) => state.merchantOrders.error;

export default merchantOrdersSlice.reducer;