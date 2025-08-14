//src/store/index.js
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import merchantAuthReducer from '../features/merchant/auth/merchantAuthSlice';
import merchantMenuReducer from '../features/merchant/menu/merchantMenuSlice';
import merchantOrdersReducer from '../features/merchant/orders/merchantOrdersSlice';
import merchantProfileReducer from '../features/merchant/storeStatus/merchantProfileSlice';
// import merchantDashboardReducer from '../features/merchant/dashboard/merchantDashboardSlice';
import merchantSetMenuReducer from '../features/merchant/setMenu/merchantSetMenuSlice';
import merchantScheduleReducer from '../features/merchant/storeStatus/merchantScheduleSlice';
import orderReducer from '../redux/orderSlice'; // 0813 Wayne 的訂單功能

const store = configureStore({
  reducer: {
    auth: authReducer,
    merchantAuth: merchantAuthReducer,
    merchantMenu: merchantMenuReducer,
    merchantOrders: merchantOrdersReducer,
    merchantProfile: merchantProfileReducer,
    // merchantDashboard: merchantDashboardReducer,
    merchantSetMenu: merchantSetMenuReducer,
    merchantSchedule: merchantScheduleReducer,
    order: orderReducer, // 0813 Wayne 的訂單功能

  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }
  ),
});

export default store;