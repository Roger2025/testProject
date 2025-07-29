//src/store/index.js
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import merchantAuthReducer from '../features/merchant/auth/merchantAuthSlice';
import merchantMenuReducer from '../features/merchant/menu/merchantMenuSlice';
// import merchantOrdersReducer from '../features/merchant/orders/merchantOrdersSlice';
// import merchantStatusReducer from '../features/merchant/storeStatus/merchantStatusSlice';
// import merchantDashboardReducer from '../features/merchant/dashboard/merchantDashboardSlice';
import merchantSetMenuReducer from '../features/merchant/setMenu/merchantSetMenuSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    merchantAuth: merchantAuthReducer,
    merchantMenu: merchantMenuReducer,
    // merchantOrders: merchantOrdersReducer,
    // merchantStatus: merchantStatusReducer,
    // merchantDashboard: merchantDashboardReducer,
    merchantSetMenu: merchantSetMenuReducer,
  },
});

export default store;