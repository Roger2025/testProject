// features/merchant/menu/merchantMenuSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { merchantApi } from '../../../services/merchantApi';

// 餐點類別選項
export const MENU_CATEGORIES = [
  { value: 'burger', label: '漢堡類', code: '01' },
  { value: 'egg-pancake', label: '蛋餅類', code: '02' },
  { value: 'toast', label: '吐司類', code: '03' },
  { value: 'noodles', label: '麵食類', code: '04' },
  { value: 'single', label: '單品類', code: '05' },
  { value: 'drink', label: '飲料類', code: '06' }
];

// 飲料選項配置
export const DRINK_OPTIONS = {
  size: [
    { value: 'small', label: '小杯', price: 15 },
    { value: 'medium', label: '中杯', price: 20 },
    { value: 'large', label: '大杯', price: 30 }
  ],
  temperature: [
    { value: 'hot', label: '熱' },
    { value: 'warm', label: '溫' },
    { value: 'normal', label: '常溫' },
    { value: 'cool', label: '涼' },
    { value: 'ice', label: '冰' }
  ]
};

// Async thunks
export const fetchMenuItems = createAsyncThunk(
  'merchantMenu/fetchMenuItems',
  async (merchantId, { rejectWithValue }) => {
    try {
      const response = await merchantApi.getMenuItems(merchantId);
      return response.data.data; // 只取陣列本體
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || '獲取菜單失敗');
    }
  }
);

export const createMenuItem = createAsyncThunk(
  'merchantMenu/createMenuItem',
  async ({ merchantId, menuData, imageFile }, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      
      // 添加菜單數據
      Object.keys(menuData).forEach(key => {
        if (menuData[key] !== null && menuData[key] !== undefined) {
          if (typeof menuData[key] === 'object') {
            formData.append(key, JSON.stringify(menuData[key]));
          } else {
            formData.append(key, menuData[key]);
          }
        }
      });
      
      // 添加圖片文件
      if (imageFile) {
        formData.append('image', imageFile);
      }
      
      formData.append('merchantId', merchantId);
      
      const response = await merchantApi.createMenuItem(formData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || '新增餐點失敗');
    }
  }
);

export const updateMenuItem = createAsyncThunk(
  'merchantMenu/updateMenuItem',
  async ({ itemId, menuData, imageFile }, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      
      Object.keys(menuData).forEach(key => {
        if (menuData[key] !== null && menuData[key] !== undefined) {
          if (typeof menuData[key] === 'object') {
            formData.append(key, JSON.stringify(menuData[key]));
          } else {
            formData.append(key, menuData[key]);
          }
        }
      });
      
      if (imageFile) {
        formData.append('image', imageFile);
      }
      
      const response = await merchantApi.updateMenuItem(itemId, formData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || '更新餐點失敗');
    }
  }
);

export const deleteMenuItem = createAsyncThunk(
  'merchantMenu/deleteMenuItem',
  async (itemId, { rejectWithValue }) => {
    try {
      await merchantApi.deleteMenuItem(itemId);
      return itemId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || '刪除餐點失敗');
    }
  }
);

const initialState = {
  items: [],
  currentItem: null,
  loading: false,
  error: null,
  lastFetch: null, // 用於判斷是否需要重新獲取數據
  operationStatus: {
    creating: false,
    updating: false,
    deleting: false
  }
};

const merchantMenuSlice = createSlice({
  name: 'merchantMenu',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setCurrentItem: (state, action) => {
      state.currentItem = action.payload;
    },
    clearCurrentItem: (state) => {
      state.currentItem = null;
    },
    // 本地更新項目，避免不必要的API調用
    updateItemLocally: (state, action) => {
      const { id, updates } = action.payload;
      const index = state.items.findIndex(item => item._id === id);
      if (index !== -1) {
        state.items[index] = { ...state.items[index], ...updates };
      }
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch menu items
      .addCase(fetchMenuItems.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMenuItems.fulfilled, (state, action) => {
        state.loading = false;
        state.items = Array.isArray(action.payload) ? action.payload : [];  // 加入防呆避免卡在304導致state.items = undefined
        state.lastFetch = Date.now();
        state.error = null;
      })
      .addCase(fetchMenuItems.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Create menu item
      .addCase(createMenuItem.pending, (state) => {
        state.operationStatus.creating = true;
        state.error = null;
      })
      .addCase(createMenuItem.fulfilled, (state, action) => {
        state.operationStatus.creating = false;
        state.items.push(action.payload);
        state.error = null;
      })
      .addCase(createMenuItem.rejected, (state, action) => {
        state.operationStatus.creating = false;
        state.error = action.payload;
      })
      
      // Update menu item
      .addCase(updateMenuItem.pending, (state) => {
        state.operationStatus.updating = true;
        state.error = null;
      })
      .addCase(updateMenuItem.fulfilled, (state, action) => {
        state.operationStatus.updating = false;
        const index = state.items.findIndex(item => item._id === action.payload._id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
        state.error = null;
      })
      .addCase(updateMenuItem.rejected, (state, action) => {
        state.operationStatus.updating = false;
        state.error = action.payload;
      })
      
      // Delete menu item
      .addCase(deleteMenuItem.pending, (state) => {
        state.operationStatus.deleting = true;
        state.error = null;
      })
      .addCase(deleteMenuItem.fulfilled, (state, action) => {
        state.operationStatus.deleting = false;
        state.items = state.items.filter(item => item._id !== action.payload);
        state.error = null;
      })
      .addCase(deleteMenuItem.rejected, (state, action) => {
        state.operationStatus.deleting = false;
        state.error = action.payload;
      });
  }
});

export const { 
  clearError, 
  setCurrentItem, 
  clearCurrentItem, 
  updateItemLocally 
} = merchantMenuSlice.actions;

export default merchantMenuSlice.reducer;