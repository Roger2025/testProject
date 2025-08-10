// src/features/merchant/auth/merchantAuthSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null,            // { merchantId, role, ... }
  isAuthenticated: false,
  loading: false,
  error: null,
};

const slice = createSlice({
  name: 'merchantAuth',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;             // 需含 merchantId
      state.isAuthenticated = !!action.payload;
      state.error = null;
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
    },
    setLoading: (state, action) => { state.loading = action.payload; },
    setError:   (state, action) => { state.error   = action.payload; },
    clearError: (state) => { state.error = null; },
  },
});

export const { setUser, logout, setLoading, setError, clearError } = slice.actions;
export default slice.reducer;


// export const { setUser, logout, setLoading, setError, clearError } = merchantAuthSlice.actions;
// export default merchantAuthSlice.reducer;