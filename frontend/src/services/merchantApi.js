// services/merchantApi.js
import axios from 'axios';
import { getEffectiveMerchantId } from '../utils/getMerchantId';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

const apiClient = axios.create({
baseURL: API_BASE_URL,
timeout: 10000,
});

// 請求攔截器 - 添加 token
apiClient.interceptors.request.use(
(config) => {
  const token = localStorage.getItem('merchantToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
},
(error) => Promise.reject(error)
);

// 響應攔截器
apiClient.interceptors.response.use(
(response) => response,
(error) => {
  if (error.response?.status === 401) {
    localStorage.removeItem('merchantToken');
    localStorage.removeItem('merchantId');
    window.location.href = '/merchant/login';
  }
  return Promise.reject(error);
}
);

const rawMerchantId = localStorage.getItem('merchantId');
const merchantId = getEffectiveMerchantId(rawMerchantId);

export const merchantApi = {
// 單品
getMenuItems: (merchantId) => apiClient.get(`/api/merchant/${merchantId}/menu`),

getMenuItem: (merchantId, itemId) =>
  apiClient.get(`/api/merchant/${merchantId}/menu/${itemId}`, {
    headers: { 'Cache-Control': 'no-cache' },
  }),

createMenuItem: (merchantId, formData) =>
  apiClient.post(`/api/merchant/${merchantId}/menu`, formData),

updateMenuItem: (merchantId, itemId, formData) =>
  apiClient.put(`/api/merchant/${merchantId}/menu/${itemId}`, formData),

deleteMenuItem: (merchantId, itemId) =>
  apiClient.delete(`/api/merchant/${merchantId}/menu/${itemId}`),

updateMenuItemsStatus: (merchantId, itemIds, available) =>
  apiClient.patch(`/api/merchant/${merchantId}/menu/batch-status`, {
    itemIds,
    available,
  }),

// 套餐（對齊 single menu 的 merchantId 路徑）
getSetMenus: (merchantId) => apiClient.get(`/api/merchant/${merchantId}/setmenu`),

getSetMenu: (merchantId, setMenuId) => apiClient.get(`/api/merchant/${merchantId}/setmenu/${setMenuId}`),

createSetMenu: (merchantId, formData) => apiClient.post(`/api/merchant/${merchantId}/setmenu`, formData),

updateSetMenu: (merchantId, setMenuId, formData) => apiClient.put(`/api/merchant/${merchantId}/setmenu/${setMenuId}`, formData),

deleteSetMenu: (merchantId, setMenuId) => apiClient.delete(`/api/merchant/${merchantId}/setmenu/${setMenuId}`),

// 認證 / 商家資料 / 訂單 等等
merchantLogin: (credentials) => apiClient.post('/api/merchant/auth/login', credentials),
merchantLogout: () => apiClient.post('/api/merchant/auth/logout'),
verifyMerchantToken: () => apiClient.get('/api/merchant/auth/verify'),
merchantRegister: (merchantData) => apiClient.post('/api/merchant/auth/register', merchantData),

getMerchantProfile: (merchantId) => apiClient.get(`/api/merchant/${merchantId}/profile`),
updateMerchantProfile: (merchantId, profileData) =>
  apiClient.put(`/api/merchant/${merchantId}/profile`, profileData),

getMerchantOrders: (merchantId, params = {}) => {
  const qs = new URLSearchParams(params).toString();
  return apiClient.get(`/api/merchant/${merchantId}/orders${qs ? '?' + qs : ''}`);
},
// updateOrderStatus: (orderId, status) =>
//   apiClient.patch(`/api/merchant/orders/${orderId}/status`, { status }),

getMerchantStatus: (merchantId) => apiClient.get(`/api/merchant/${merchantId}/status`),
updateMerchantStatus: (merchantId, statusData) =>
  apiClient.put(`/api/merchant/${merchantId}/status`, statusData),

getMerchantDashboard: (merchantId, dateRange = {}) => {
  const qs = new URLSearchParams(dateRange).toString();
  return apiClient.get(`/api/merchant/${merchantId}/dashboard${qs ? '?' + qs : ''}`);
},
getSalesReport: (merchantId, params = {}) => {
  const qs = new URLSearchParams(params).toString();
  return apiClient.get(`/api/merchant/${merchantId}/reports/sales${qs ? '?' + qs : ''}`);
},

// 獲取營業排程
getSchedule: (merchantId) => apiClient.get(`/api/merchant/schedule/${merchantId}`),

// 更新營業排程
updateSchedule: (merchantId, scheduleData) =>
  apiClient.put(`/api/merchant/schedule/${merchantId}`, scheduleData),

// 檢查當前營業狀態
checkStatus: (merchantId) => apiClient.get(`/api/merchant/schedule/${merchantId}/status`),

// 獲取一週營業概況
getWeeklyOverview: (merchantId) => {apiClient.get(`/api/merchant/schedule/${merchantId}/overview`)},


// 取得今日訂單
getTodayOrders: () => {
  // const merchantId = getMerchantId(); // 假設這是取得商家ID的工具函式
  return apiClient.get(`/api/merchant/orders/today/${merchantId}`);
},

// 更新訂單狀態
updateOrderStatus: (orderId, status) => {
  return apiClient.patch(`/api/merchant/orders/${orderId}/status`, { 
    status,
    merchantId: merchantId
  });
},

// 取得訂單統計
getOrderStats: (date = null) => {
  const params = date ? { date } : {};
  return apiClient.get(`/api/merchant/orders/stats/${merchantId}`, { params });
},

// 取得單一訂單詳情
getOrderById: (orderId) => {
  return apiClient.get(`/api/merchant/orders/${orderId}`);
},

// 取得指定日期範圍的訂單
getOrdersByDateRange: (startDate, endDate) => {
  return apiClient.get(`/api/merchant/orders/range/${merchantId}`, {
    params: { startDate, endDate }
  });
},

// 取得指定狀態的訂單
getOrdersByStatus: (status) => {
  return apiClient.get(`/api/merchant/orders/status/${status}/${merchantId}`);
},


// 上傳
uploadMerchantLogo: (merchantId, logoFile) => {
  const formData = new FormData();
  formData.append('logo', logoFile);
  return apiClient.post(`/api/merchant/${merchantId}/upload/logo`, formData);
},

uploadMenuItemImage: (itemId, imageFile) => {
  const formData = new FormData();
  formData.append('image', imageFile);
  return apiClient.post(`/api/merchant/menu/${itemId}/upload/image`, formData);
},

// 圖片 URL helper（保守處理斜線避免重複）
getImageUrl: (imagePath) => {
  if (!imagePath) return null;
  if (imagePath.startsWith('http')) return imagePath;
  const prefix = imagePath.startsWith('/') ? '' : '/';
  return `${API_BASE_URL}${prefix}${imagePath}`;
},

// 錯誤處理
handleApiError: (error) => {
  if (error.response) {
    const { status, data } = error.response;
    switch (status) {
      case 400:
        return data.message || '請求參數錯誤';
      case 401:
        return '未授權，請重新登入';
      case 403:
        return '權限不足';
      case 404:
        return '資源不存在';
      case 422:
        return data.message || '資料驗證失敗';
      case 500:
        return '伺服器內部錯誤';
      default:
        return data.message || '發生未知錯誤';
    }
  } else if (error.request) {
    return '網路連線失敗，請檢查網路連線';
  } else {
    return error.message || '發生未知錯誤';
  }
},

retry: async (apiCall, maxRetries = 3, delay = 1000) => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await apiCall();
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      if (!error.response || error.response.status >= 500) {
        await new Promise((r) => setTimeout(r, delay * Math.pow(2, i)));
      } else {
        throw error;
      }
    }
  }
},
};

export default merchantApi;