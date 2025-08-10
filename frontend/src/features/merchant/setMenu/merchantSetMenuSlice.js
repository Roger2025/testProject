// features/merchant/setMenu/merchantSetMenuSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { merchantApi } from '../../../services/merchantApi';
import { getEffectiveMerchantId } from '../../../utils/getMerchantId';

// 套餐類別選項（可以根據需要調整）
export const SET_MENU_CATEGORIES = [
  { value: 'breakfast', label: '早餐套餐', code: '01' },
  { value: 'brunch', label: '早午餐套餐', code: '02' },
  { value: 'value', label: '超值套餐', code: '03' },
  { value: 'premium', label: '精選套餐', code: '04' },
  { value: 'family', label: '家庭套餐', code: '05' }
];

// helpers
const resolveMerchantId = (override) => {
  if (override) return override;
  const rawMerchantId = localStorage.getItem('merchantId');
  return getEffectiveMerchantId(rawMerchantId);
};

const extractErrorMessage = (error, fallback) => {
  return error?.response?.data?.message || error?.message || fallback;
};

// Fetch set menu items
export const fetchSetMenuItems = createAsyncThunk(
  'merchantSetMenu/fetchSetMenuItems',
  async (merchantIdArg, { rejectWithValue }) => {
    try {
      const merchantId = resolveMerchantId(merchantIdArg);
      if (!merchantId) return rejectWithValue('缺少店家身份，請先登入');

      const response = await merchantApi.getSetMenus(merchantId);
      return response.data?.data || [];
    } catch (error) {
      return rejectWithValue(extractErrorMessage(error, '獲取套餐失敗'));
    }
  }
);

// Create set menu item
export const createSetMenuItem = createAsyncThunk(
  'merchantSetMenu/createSetMenuItem',
  async ({ merchantId: merchantIdArg, setMenuData, imageFile }, { rejectWithValue }) => {
    try {
      const merchantId = resolveMerchantId(merchantIdArg);
      if (!merchantId) return rejectWithValue('缺少店家身份，請先登入');

      const formData = new FormData();
      Object.entries(setMenuData || {}).forEach(([key, val]) => {
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

      const response = await merchantApi.createSetMenu(merchantId, formData);
      return response.data?.data;
    } catch (error) {
      return rejectWithValue(extractErrorMessage(error, '新增套餐失敗'));
    }
  }
);

// Update set menu item
export const updateSetMenuItem = createAsyncThunk(
  'merchantSetMenu/updateSetMenuItem',
  async ({ merchantId: merchantIdArg, itemId, setMenuData, imageFile }, { rejectWithValue }) => {
    try {
      const merchantId = resolveMerchantId(merchantIdArg);
      if (!merchantId) return rejectWithValue('缺少店家身份，請先登入');

      const formData = new FormData();
      Object.entries(setMenuData || {}).forEach(([key, val]) => {
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

      const response = await merchantApi.updateSetMenu(merchantId, itemId, formData);
      return response.data?.data;
    } catch (error) {
      return rejectWithValue(extractErrorMessage(error, '更新套餐失敗'));
    }
  }
);

// Delete set menu item
export const deleteSetMenuItem = createAsyncThunk(
  'merchantSetMenu/deleteSetMenuItem',
  async ({ merchantId: merchantIdArg, itemId }, { rejectWithValue }) => {
    try {
      const merchantId = resolveMerchantId(merchantIdArg);
      if (!merchantId) return rejectWithValue('缺少店家身份，請先登入');

      await merchantApi.deleteSetMenu(merchantId, itemId);
      return itemId;
    } catch (error) {
      return rejectWithValue(extractErrorMessage(error, '刪除套餐失敗'));
    }
  }
);

const initialState = {
  items: [],
  currentItem: null,
  loading: false,
  error: null,
  lastFetch: null,
  operationStatus: {
    creating: false,
    updating: false,
    deleting: false
  }
};

const merchantSetMenuSlice = createSlice({
  name: 'merchantSetMenu',
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
      .addCase(fetchSetMenuItems.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSetMenuItems.fulfilled, (state, action) => {
        state.loading = false;
        state.items = Array.isArray(action.payload) ? action.payload : [];
        state.lastFetch = Date.now();
        state.error = null;
      })
      .addCase(fetchSetMenuItems.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // create
      .addCase(createSetMenuItem.pending, (state) => {
        state.operationStatus.creating = true;
        state.error = null;
      })
      .addCase(createSetMenuItem.fulfilled, (state, action) => {
        state.operationStatus.creating = false;
        if (action.payload) state.items.push(action.payload);
        state.error = null;
      })
      .addCase(createSetMenuItem.rejected, (state, action) => {
        state.operationStatus.creating = false;
        state.error = action.payload;
      })

      // update
      .addCase(updateSetMenuItem.pending, (state) => {
        state.operationStatus.updating = true;
        state.error = null;
      })
      .addCase(updateSetMenuItem.fulfilled, (state, action) => {
        state.operationStatus.updating = false;
        const idx = state.items.findIndex(item => item._id === action.payload?._id);
        if (idx !== -1 && action.payload) {
          state.items[idx] = action.payload;
        }
        state.error = null;
      })
      .addCase(updateSetMenuItem.rejected, (state, action) => {
        state.operationStatus.updating = false;
        state.error = action.payload;
      })

      // delete
      .addCase(deleteSetMenuItem.pending, (state) => {
        state.operationStatus.deleting = true;
        state.error = null;
      })
      .addCase(deleteSetMenuItem.fulfilled, (state, action) => {
        state.operationStatus.deleting = false;
        state.items = state.items.filter(item => item._id !== action.payload);
        state.error = null;
      })
      .addCase(deleteSetMenuItem.rejected, (state, action) => {
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
} = merchantSetMenuSlice.actions;

export default merchantSetMenuSlice.reducer;