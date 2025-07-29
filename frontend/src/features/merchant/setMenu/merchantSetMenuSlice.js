// features/merchant/setMenu/merchantSetMenuSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import merchantApi from '../../../services/merchantApi';

const {
  getSetMenus,
  createSetMenu,
  updateSetMenu: apiUpdateSetMenu,  //改名避免衝突
  deleteSetMenu: apiDeleteSetMenu //改名避免衝突
}  = merchantApi;
// 初始狀態
const initialState = {
  setMenus: [],
  loading: false,
  error: null,
};

// === Async Thunks ===

// 取得某商家的所有套餐
export const fetchMerchantSetMenus = createAsyncThunk(
  'merchantSetMenu/fetchMerchantSetMenus',
  async (merchantId, thunkAPI) => {
    try {
      const response = await getSetMenus(merchantId);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || 'Fetch failed');
    }
  }
);

// 新增套餐
export const addSetMenu = createAsyncThunk(
  'merchantSetMenu/addSetMenu',
  async (setMenuData, thunkAPI) => {
    try {
      const response = await createSetMenu(setMenuData);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || 'Create failed');
    }
  }
);

// 更新套餐
export const updateSetMenu = createAsyncThunk(
  'merchantSetMenu/updateSetMenu',
  async ({ id, data }, thunkAPI) => {
    try {
      const response = await apiUpdateSetMenu(id, data);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || 'Update failed');
    }
  }
);

// 刪除套餐
export const deleteSetMenu = createAsyncThunk(
  'merchantSetMenu/deleteSetMenu',
  async (id, thunkAPI) => {
    try {
      await apiDeleteSetMenu(id);
      return id;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || 'Delete failed');
    }
  }
);

// 切換套餐上架狀態
export const toggleSetMenuStatus = createAsyncThunk(
  'merchantSetMenu/toggleSetMenuStatus',
  async ({ id, available }, thunkAPI) => {
    try {
      const response = await updateSetMenu(id, { available });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || 'Toggle status failed');
    }
  }
);

// === Slice ===

const merchantSetMenuSlice = createSlice({
  name: 'merchantSetMenu',
  initialState,
  reducers: {
    // 清除錯誤狀態
    clearError: (state) => {
      state.error = null;
    },
    // 重置狀態
    resetSetMenuState: (state) => {
      state.setMenus = [];
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // 取得所有套餐
      .addCase(fetchMerchantSetMenus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMerchantSetMenus.fulfilled, (state, action) => {
        state.loading = false;
        // 依照 createdAt 新→舊 排序
        state.setMenus = action.payload.slice().sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
      })
      .addCase(fetchMerchantSetMenus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // 新增套餐
      .addCase(addSetMenu.pending, (state) => {
        state.error = null;
      })
      .addCase(addSetMenu.fulfilled, (state, action) => {
        // 新增的項目放在陣列最前面
        state.setMenus.unshift(action.payload);
      })
      .addCase(addSetMenu.rejected, (state, action) => {
        state.error = action.payload;
      })

      // 更新套餐
      .addCase(updateSetMenu.pending, (state) => {
        state.error = null;
      })
      .addCase(updateSetMenu.fulfilled, (state, action) => {
        const index = state.setMenus.findIndex((item) => item._id === action.payload._id);
        if (index !== -1) {
          state.setMenus[index] = action.payload;
        }
      })
      .addCase(updateSetMenu.rejected, (state, action) => {
        state.error = action.payload;
      })

      // 刪除套餐
      .addCase(deleteSetMenu.pending, (state) => {
        state.error = null;
      })
      .addCase(deleteSetMenu.fulfilled, (state, action) => {
        state.setMenus = state.setMenus.filter((item) => item._id !== action.payload);
      })
      .addCase(deleteSetMenu.rejected, (state, action) => {
        state.error = action.payload;
      })

      // 切換套餐狀態
      .addCase(toggleSetMenuStatus.pending, (state) => {
        state.error = null;
      })
      .addCase(toggleSetMenuStatus.fulfilled, (state, action) => {
        const index = state.setMenus.findIndex((item) => item._id === action.payload._id);
        if (index !== -1) {
          state.setMenus[index] = action.payload;
        }
      })
      .addCase(toggleSetMenuStatus.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

// 匯出 actions
export const { clearError, resetSetMenuState } = merchantSetMenuSlice.actions;

// 匯出 reducer
export default merchantSetMenuSlice.reducer;