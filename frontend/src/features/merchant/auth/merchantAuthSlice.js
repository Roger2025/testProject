// // src/features/merchant/auth/merchantAuthSlice.js
// import { createSlice } from '@reduxjs/toolkit';

// const initialState = {
//   merchant: null,
//   token: null,
//   loading: false,
//   error: null,
// };

// const merchantAuthSlice = createSlice({
//   name: 'merchantAuth',
//   initialState,
//   reducers: {
//     loginStart: (state) => {
//       state.loading = true;
//       state.error = null;
//     },
//     loginSuccess: (state, action) => {
//       state.merchant = action.payload.merchant;
//       state.token = action.payload.token;
//       state.loading = false;
//     },
//     loginFailure: (state, action) => {
//       state.error = action.payload;
//       state.loading = false;
//     },
//     logout: (state) => {
//       state.merchant = null;
//       state.token = null;
//     },
//   },
// });

// export const { loginStart, loginSuccess, loginFailure, logout } = merchantAuthSlice.actions;

// export default merchantAuthSlice.reducer;

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
      state.merchant = action.payload;
      state.isAuthenticated = true;
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
