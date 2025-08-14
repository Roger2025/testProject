// src/features/merchant/storeStatus/merchantProfileSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { merchantApi } from '../../../services/merchantApi';

// 後端 Admin 管控，前端不可更新
// const READONLY_FIELDS = ['category'];

// 允許前端更新的欄位（可依實際 schema 增減）
const EDITABLE_FIELDS = [
  'name',
  'email',
  'phone',
  'storeName',
  'storeAddress',
  'category'
];

// 共用：保險擷取 message
const pickMessage = (res, fallback) =>
  res?.data?.message || res?.message || fallback;

// 共用：取 data 區塊
const pickData = (res) => res?.data?.data ?? res?.data ?? res;

// 共用：過濾 payload（移除不可編輯 + 只留白名單）
const sanitizeProfileData = (payload) => {
  const clean = {};
  for (const k of EDITABLE_FIELDS) {
    if (payload[k] !== undefined) clean[k] = payload[k];
  }
  // 把 category 只保留布林
  if (clean.category && typeof clean.category === 'object') {
    const cat = {};
    for (const [k, v] of Object.entries(clean.category)) cat[k] = !!v;
    clean.category = cat;
  }
  return clean;
};

// 初始狀態
const initialState = {
  profile: null,
  loading: false,
  error: null,
  successMessage: null,
  uploadLoading: false,
  uploadError: null,
};

// 取得商家資料
export const fetchMerchantProfile = createAsyncThunk(
  'merchantProfile/fetchProfile',
  async (_, { rejectWithValue }) => {
    try {
      const res = await merchantApi.getMerchantProfile();
      return pickData(res);
    } catch (error) {
      return rejectWithValue(merchantApi.handleApiError(error));
    }
  }
);

// 更新商家資料（過濾不可編輯欄位）
export const updateMerchantProfile = createAsyncThunk(
  'merchantProfile/updateProfile',
  async (profileData, { rejectWithValue }) => {
    try {
      const safePayload = sanitizeProfileData(profileData);
      const res = await merchantApi.updateMerchantProfile(safePayload);
      return {
        profile: pickData(res),
        message: pickMessage(res, '商家資料更新成功'),
      };
    } catch (error) {
      return rejectWithValue(merchantApi.handleApiError(error));
    }
  }
);

// 上傳商家 Logo
export const uploadMerchantLogo = createAsyncThunk(
  'merchantProfile/uploadLogo',
  async (logoFile, { rejectWithValue }) => {
    try {
      const res = await merchantApi.uploadMerchantLogo(logoFile);
      const data = pickData(res);
      return {
        imageUrl: data?.imageUrl || data?.storeImage || data,
        message: pickMessage(res, 'Logo 上傳成功'),
      };
    } catch (error) {
      return rejectWithValue(merchantApi.handleApiError(error));
    }
  }
);

const merchantProfileSlice = createSlice({
  name: 'merchantProfile',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
      state.uploadError = null;
    },
    clearSuccessMessage: (state) => {
      state.successMessage = null;
    },
    clearProfileMessages: (state) => {
      state.error = null;
      state.successMessage = null;
      state.uploadError = null;
    },
    resetProfileState: () => initialState,
    updateLocalProfile: (state, action) => {
      state.profile = { ...(state.profile || {}), ...(action.payload || {}) };
    },
  },
  extraReducers: (b) => {
    b // fetch
      .addCase(fetchMerchantProfile.pending, (s) => {
        s.loading = true; s.error = null;
      })
      .addCase(fetchMerchantProfile.fulfilled, (s, a) => {
        s.loading = false; s.profile = a.payload; s.error = null;
      })
      .addCase(fetchMerchantProfile.rejected, (s, a) => {
        s.loading = false; s.error = a.payload; s.profile = null;
      })

      // update
      .addCase(updateMerchantProfile.pending, (s) => {
        s.loading = true; s.error = null; s.successMessage = null;
      })
      .addCase(updateMerchantProfile.fulfilled, (s, a) => {
        s.loading = false;
        // 以 merge 方式更新，避免覆蓋掉後端未回傳的欄位
        s.profile = { ...(s.profile || {}), ...(a.payload?.profile || {}) };
        s.successMessage = a.payload?.message || null;
        s.error = null;
      })
      .addCase(updateMerchantProfile.rejected, (s, a) => {
        s.loading = false; s.error = a.payload; s.successMessage = null;
      })

      // upload logo
      .addCase(uploadMerchantLogo.pending, (s) => {
        s.uploadLoading = true; s.uploadError = null;
      })
      .addCase(uploadMerchantLogo.fulfilled, (s, a) => {
        s.uploadLoading = false;
        const img = a.payload?.imageUrl;
        if (img) {
          s.profile = { ...(s.profile || {}), storeImage: img };
        }
        // 若先前已有成功訊息則保留較新的
        s.successMessage = a.payload?.message || s.successMessage || 'Logo 上傳成功';
        s.uploadError = null;
      })
      .addCase(uploadMerchantLogo.rejected, (s, a) => {
        s.uploadLoading = false; s.uploadError = a.payload;
      });
  },
});

export const {
  clearError,
  clearSuccessMessage,
  clearProfileMessages,
  resetProfileState,
  updateLocalProfile,
} = merchantProfileSlice.actions;

// selectors（維持你的對外 API）
export const selectMerchantProfile = (state) => state.merchantProfile.profile;
export const selectMerchantProfileLoading = (state) => state.merchantProfile.loading;
export const selectMerchantProfileError = (state) => state.merchantProfile.error;
export const selectMerchantProfileSuccess = (state) => state.merchantProfile.successMessage;
export const selectUploadLoading = (state) => state.merchantProfile.uploadLoading;
export const selectUploadError = (state) => state.merchantProfile.uploadError;
export const selectAnyLoading = (state) =>
  state.merchantProfile.loading || state.merchantProfile.uploadLoading;
export const selectAnyError = (state) =>
  state.merchantProfile.error || state.merchantProfile.uploadError;

export default merchantProfileSlice.reducer;