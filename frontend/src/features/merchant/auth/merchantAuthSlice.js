// features/merchantAuth/merchantAuthSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  merchant: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

const merchantAuthSlice = createSlice({
  name: 'merchantAuth',
  initialState,
  reducers: {
    login: (state, action) => {
      state.isAuthenticated = false;
      state.merchantId = null;
      state.merchantInfo = null;
      state.token = null;
      state.loading = false;
      state.error = null;
    },
    logout: (state) => {
      state.merchant = null;
      state.isAuthenticated = false;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const { login, logout, setLoading, setError, clearError } = merchantAuthSlice.actions;
export default merchantAuthSlice.reducer;
