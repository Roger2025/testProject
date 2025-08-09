<<<<<<< HEAD
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { merchantApi } from '../../../services/merchantApi';
=======
// features/merchant/orders/merchantOrdersSlice.js

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import merchantApi from '../../../services/merchantApi';

// === Thunks ===
>>>>>>> alan

// 取得今日訂單
export const fetchTodayOrders = createAsyncThunk(
  'merchantOrders/fetchTodayOrders',
<<<<<<< HEAD
  async (_, { rejectWithValue }) => {
    try {
      const response = await merchantApi.getTodayOrders();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || '取得訂單失敗');
=======
  async (merchantId, { rejectWithValue }) => {
    try {
      const response = await merchantApi.getTodayOrders(merchantId);
      return response.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || '載入今日訂單失敗');
>>>>>>> alan
    }
  }
);

// 更新訂單狀態
export const updateOrderStatus = createAsyncThunk(
  'merchantOrders/updateOrderStatus',
<<<<<<< HEAD
  async ({ orderId, status }, { rejectWithValue }) => {
    try {
      const response = await merchantApi.updateOrderStatus(orderId, status);
      return { orderId, status, updatedOrder: response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || '更新訂單狀態失敗');
=======
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
>>>>>>> alan
    }
  }
);

<<<<<<< HEAD
// 取得訂單統計
export const fetchOrderStats = createAsyncThunk(
  'merchantOrders/fetchOrderStats',
  async (date, { rejectWithValue }) => {
    try {
      const response = await merchantApi.getOrderStats(date);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || '取得統計失敗');
=======
// 取得今日統計
export const fetchTodayStats = createAsyncThunk(
  'merchantOrders/fetchTodayStats',
  async (merchantId, { rejectWithValue }) => {
    try {
      const response = await merchantApi.getOrderStats(merchantId);
      return response.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || '載入統計資料失敗');
>>>>>>> alan
    }
  }
);

<<<<<<< HEAD
const initialState = {
  orders: [],
  todayStats: {
    totalOrders: 0,
    totalAmount: 0
  },
  loading: false,
  error: null,
  lastFetchTime: null
};

const merchantOrdersSlice = createSlice({
  name: 'merchantOrders',
  initialState,
  reducers: {
    // 清除錯誤訊息
    clearError: (state) => {
      state.error = null;
    },
    // 重置訂單狀態
    resetOrders: (state) => {
      state.orders = [];
      state.todayStats = {
        totalOrders: 0,
        totalAmount: 0
      };
      state.error = null;
    },
    // 新增新訂單（用於 WebSocket 或輪詢更新）
    addNewOrder: (state, action) => {
      const newOrder = action.payload;
      // 檢查是否已存在相同訂單
      const existingOrderIndex = state.orders.findIndex(
        order => order.order_id === newOrder.order_id
      );
      
      if (existingOrderIndex === -1) {
        // 新訂單加到最後（最新）
        state.orders.push(newOrder);
        // 更新統計
        state.todayStats.totalOrders += 1;
        state.todayStats.totalAmount += newOrder.total_amount;
      }
    },
    // 更新單一訂單狀態（用於即時更新）
    updateSingleOrderStatus: (state, action) => {
      const { orderId, status } = action.payload;
      const orderIndex = state.orders.findIndex(
        order => order.order_id === orderId
      );
      
      if (orderIndex !== -1) {
        state.orders[orderIndex].order_status = status;
      }
    }
  },
  extraReducers: (builder) => {
    builder
      // 取得今日訂單
=======
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
>>>>>>> alan
      .addCase(fetchTodayOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTodayOrders.fulfilled, (state, action) => {
<<<<<<< HEAD
        state.loading = false;
        state.orders = action.payload.orders || [];
        state.todayStats = action.payload.stats || {
          totalOrders: 0,
          totalAmount: 0
        };
        state.lastFetchTime = new Date().toISOString();
        state.error = null;
=======
        state.orders = action.payload;
        state.loading = false;
>>>>>>> alan
      })
      .addCase(fetchTodayOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
<<<<<<< HEAD
      })
      
      // 更新訂單狀態
      .addCase(updateOrderStatus.pending, (state) => {
        state.error = null;
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        const { orderId, status } = action.payload;
        const orderIndex = state.orders.findIndex(
          order => order.order_id === orderId
        );
        
        if (orderIndex !== -1) {
          state.orders[orderIndex].order_status = status;
        }
        state.error = null;
      })
      .addCase(updateOrderStatus.rejected, (state, action) => {
        state.error = action.payload;
      })
      
      // 取得訂單統計
      .addCase(fetchOrderStats.fulfilled, (state, action) => {
        state.todayStats = action.payload;
      });
  }
});

// Actions
export const { 
  clearError, 
  resetOrders, 
  addNewOrder, 
  updateSingleOrderStatus 
} = merchantOrdersSlice.actions;

// Selectors
export const selectOrders = (state) => state.merchantOrders.orders;
export const selectOrdersLoading = (state) => state.merchantOrders.loading;
export const selectOrdersError = (state) => state.merchantOrders.error;
export const selectTodayStats = (state) => state.merchantOrders.todayStats;
export const selectLastFetchTime = (state) => state.merchantOrders.lastFetchTime;

// 複合選擇器
export const selectOrderById = (orderId) => (state) => 
  state.merchantOrders.orders.find(order => order.order_id === orderId);

export const selectOrdersByStatus = (status) => (state) =>
  state.merchantOrders.orders.filter(order => order.order_status === status);

export const selectPendingOrdersCount = (state) => 
  state.merchantOrders.orders.filter(order => 
    ['PENDING', 'CONFIRMED', 'PREPARING'].includes(order.order_status)
  ).length;
=======
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
>>>>>>> alan

export default merchantOrdersSlice.reducer;