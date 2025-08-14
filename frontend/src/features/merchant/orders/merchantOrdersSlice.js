// features/merchant/orders/merchantOrdersSlice.js

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import merchantApi from '../../../services/merchantApi';

// 狀態正規化：去空白、小寫
const norm = (s) => String(s ?? '').trim().toLowerCase();

// 允許幾種同義寫法
const COMPLETED_SET = new Set(['已完成', '完成', 'completed', 'done', 'Completed'].map(norm));
export const isCompleted = (status) => COMPLETED_SET.has(norm(status));

// === Thunks ===

// 取得今日訂單
export const fetchTodayOrders = createAsyncThunk(
  'merchantOrders/fetchTodayOrders',
  async (_, { rejectWithValue }) => {
    try {
      const response = await merchantApi.getTodayOrders();
      return response.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || '載入今日訂單失敗');
    }
  }
);

// 更新訂單狀態
export const updateOrderStatus = createAsyncThunk(
  'merchantOrders/updateOrderStatus',
  async ({ orderId, status }, { rejectWithValue }) => {
    try {
      const response = await merchantApi.updateOrderStatus(orderId, status);

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
  async (_, { rejectWithValue }) => {
    try {
      const response = await merchantApi.getOrderStats();
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
        // 後端回傳 data 就是今日訂單陣列
        state.orders = Array.isArray(action.payload) ? action.payload : [];
        state.loading = false;

        // 僅統計「已完成」訂單的總金額
        const total = state.orders
          .filter(o => isCompleted(o.order_status))
          .reduce((sum, o) => {
            const n = Number(o.total_amount ?? o.total ?? o.amount ?? 0);
            return sum + (Number.isFinite(n) ? n : 0);
          }, 0);

        // 存回今天統計
        state.todayStats.totalAmount = total;
        state.todayStats.totalOrders = state.orders.length;
      })
      .addCase(fetchTodayOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // 更新訂單狀態
    builder
      // .addCase(updateOrderStatus.fulfilled, (state, action) => {
      //   const { orderId, updatedOrder } = action.payload;

      //   const index = state.orders.findIndex(order => order.order_id === orderId);
      //   if (index !== -1) {
      //     state.orders[index] = updatedOrder; // 用新的資料覆蓋舊的
      //   }

      //   state.error = null;
      // })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        const { orderId, updatedOrder } = action.payload;
        const idx = state.orders.findIndex(o => o.order_id === orderId);
        if (idx !== -1) {
          // 原本金額（若原狀態是已完成，要先扣掉）
          const prev = state.orders[idx];
          if (isCompleted(prev.order_status)) {
            const n = Number(prev.total_amount ?? prev.total ?? prev.amount ?? 0);
            if (Number.isFinite(n)) state.todayStats.totalAmount -= n;
          }

          // 覆寫
          state.orders[idx] = updatedOrder;

          // 新狀態若是已完成，加回金額
          if (isCompleted(updatedOrder.order_status)) {
            const n = Number(updatedOrder.total_amount ?? updatedOrder.total ?? updatedOrder.amount ?? 0);
            if (Number.isFinite(n)) state.todayStats.totalAmount += n;
          }
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