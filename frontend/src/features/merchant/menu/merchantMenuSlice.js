// features/merchant/menu/merchantMenuSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { merchantApi } from '../../../services/merchantApi';
import { fetchMerchantInfoFromSession } from '../../../utils/getMerchantId';  // 開發環境中提供預設merchantId

// 餐點類別選項
export const MENU_CATEGORIES = [
  { value: 'burger', label: '漢堡類', code: '01' },
  { value: 'egg-pancake', label: '蛋餅類', code: '02' },
  { value: 'toast', label: '吐司類', code: '03' },
  { value: 'noodles', label: '麵食類', code: '04' },
  { value: 'single', label: '單品類', code: '05' },
  { value: 'drink', label: '飲料類', code: '06' },
  { value: 'set-meal', label: '套餐類', code: '07' }
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

// Fetch menu items (需要傳 merchantId)
export const fetchMenuItems = createAsyncThunk(
  'merchantMenu/fetchMenuItems',
  async (merchantIdArg, { rejectWithValue }) => {
    try {
      let merchantId = merchantIdArg;
      if (!merchantId) {

        // const rawMerchantId = localStorage.getItem('merchantId');
        // merchantId = getEffectiveMerchantId(rawMerchantId);

        //整合測試及實際上線用
        const res = await fetchMerchantInfoFromSession();
        merchantId = res?.merchantId;
      }
      if (!merchantId) return rejectWithValue('缺少店家身份，請先登入');

      const response = await merchantApi.getMenuItems(merchantId);
      // 後端格式 { success, data: [...] }
      return response.data?.data || [];
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || '獲取菜單失敗');
    }
  }
);

// Create menu item
export const createMenuItem = createAsyncThunk(
  'merchantMenu/createMenuItem',
  async ({ merchantId: merchantIdArg, menuData, imageFile }, { rejectWithValue }) => {
    try {
      let merchantId = merchantIdArg;
      if (!merchantId) {
        // const rawMerchantId = localStorage.getItem('merchantId');
        // merchantId = getEffectiveMerchantId(rawMerchantId);

        //整合測試及實際上線用
        const res = await fetchMerchantInfoFromSession();
        merchantId = res?.merchantId;
      }
      if (!merchantId) return rejectWithValue('缺少店家身份，請先登入');

      const formData = new FormData();
      Object.keys(menuData).forEach(key => {
        const val = menuData[key];
        if (val !== null && val !== undefined) {
          if (typeof val === 'object') {
            formData.append(key, JSON.stringify(val));
          } else {
            formData.append(key, val);
          }
        }
      });

      if (imageFile) {
        formData.append('image', imageFile);
      }

      // 保留 merchantId 作為備援（路由通常帶）
      formData.append('merchantId', merchantId);

      const response = await merchantApi.createMenuItem(merchantId, formData);
      return response.data?.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || '新增餐點失敗');
    }
  }
);

// Update menu item
export const updateMenuItem = createAsyncThunk(
  'merchantMenu/updateMenuItem',
  async ({ merchantId: merchantIdArg, itemId, menuData, imageFile }, { rejectWithValue }) => {
    try {
      let merchantId = merchantIdArg;
      if (!merchantId) {
        // const rawMerchantId = localStorage.getItem('merchantId');
        // merchantId = getEffectiveMerchantId(rawMerchantId);

        //整合測試及實際上線用
        const res = await fetchMerchantInfoFromSession();
        merchantId = res?.merchantId;
      }
      if (!merchantId) return rejectWithValue('缺少店家身份，請先登入');

      const formData = new FormData();

      Object.keys(menuData).forEach(key => {
        const val = menuData[key];
        if (val !== null && val !== undefined) {
          if (typeof val === 'object') {
            formData.append(key, JSON.stringify(val));
          } else {
            formData.append(key, val);
          }
        }
      });

      if (imageFile) {
        formData.append('image', imageFile);
      }

      formData.append('merchantId', merchantId);

      // DEBUG log 可以保留開發期
      for (const pair of formData.entries()) {
        console.log('updateMenuItem formData:', pair[0], pair[1]);
      }

      const response = await merchantApi.updateMenuItem(merchantId, itemId, formData);
      return response.data?.data;
    } catch (error) {
      const msg = error.response?.data?.message || error.message || '更新餐點失敗';
      return rejectWithValue(msg);
    }
  }
);

// Delete menu item
export const deleteMenuItem = createAsyncThunk(
  'merchantMenu/deleteMenuItem',
  async ({ merchantId: merchantIdArg, itemId }, { rejectWithValue }) => {
    try {
      let merchantId = merchantIdArg;
      if (!merchantId) {
        // const rawMerchantId = localStorage.getItem('merchantId');
        // merchantId = getEffectiveMerchantId(rawMerchantId);

        //整合測試及實際上線用
        const res = await fetchMerchantInfoFromSession();
        merchantId = res?.merchantId;
      }
      if (!merchantId) return rejectWithValue('缺少店家身份，請先登入');

      await merchantApi.deleteMenuItem(merchantId, itemId);
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
      // fetch
      .addCase(fetchMenuItems.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMenuItems.fulfilled, (state, action) => {
        state.loading = false;
        state.items = Array.isArray(action.payload) ? action.payload : [];
        state.lastFetch = Date.now();
        state.error = null;
      })
      .addCase(fetchMenuItems.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // create
      .addCase(createMenuItem.pending, (state) => {
        state.operationStatus.creating = true;
        state.error = null;
      })
      .addCase(createMenuItem.fulfilled, (state, action) => {
        state.operationStatus.creating = false;
        if (action.payload) state.items.push(action.payload);
        state.error = null;
      })
      .addCase(createMenuItem.rejected, (state, action) => {
        state.operationStatus.creating = false;
        state.error = action.payload;
      })

      // update
      .addCase(updateMenuItem.pending, (state) => {
        state.operationStatus.updating = true;
        state.error = null;
      })
      .addCase(updateMenuItem.fulfilled, (state, action) => {
        state.operationStatus.updating = false;
        const idx = state.items.findIndex(item => item._id === action.payload?._id);
        if (idx !== -1 && action.payload) {
          state.items[idx] = action.payload;
        }
        state.error = null;
      })
      .addCase(updateMenuItem.rejected, (state, action) => {
        state.operationStatus.updating = false;
        state.error = action.payload;
      })

      // delete
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