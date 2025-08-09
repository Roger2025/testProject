// src/services/merchantApi.js
import axios from 'axios';
import { devFlags } from '../constants/devFlags';

// 環境變數：API 基礎 URL
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  withCredentials: true,
});

// ---- 狀態 getter 綁定（避免直接 import store 造成循環依賴）----
let getState;
export function bindGetState(fn) { getState = fn; }

function getMerchantIdOrThrow() {
  const state = getState?.();
  const mid =
    state?.merchantAuth?.user?.merchantId ??
    state?.merchantAuth?.merchant?.merchantId;

  if (mid) return mid;

  // 開發模式回退
  if (devFlags.bypassAuth && devFlags.mockUser?.merchantId) {
    return devFlags.mockUser.merchantId;
  }
  // 生產或未設定 → 丟錯
  throw new Error('缺少商家身分(merchantId), 請先登入');
}

// 攔截器
apiClient.interceptors.request.use((config) => config, (e) => Promise.reject(e));
apiClient.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      window.location.href = '/merchant/login';
    }
    return Promise.reject(err);
  }
);

// === 以下維持你之前重構後的 API（用 getMerchantIdOrThrow 取 merchantId）===
export const merchantApi = {
  // 單品
  getMenuItems: () => {
    const merchantId = getMerchantIdOrThrow();
    return apiClient.get(`/api/merchant/${merchantId}/menu`);
  },
  getMenuItem: (itemId) => {
    const merchantId = getMerchantIdOrThrow();
    return apiClient.get(`/api/merchant/${merchantId}/menu/${itemId}`, {
      headers: { 'Cache-Control': 'no-cache' },
    });
  },
  createMenuItem: (formData) => {
    const merchantId = getMerchantIdOrThrow();
    return apiClient.post(`/api/merchant/${merchantId}/menu`, formData);
  },
  updateMenuItem: (itemId, formData) => {
    const merchantId = getMerchantIdOrThrow();
    return apiClient.put(`/api/merchant/${merchantId}/menu/${itemId}`, formData);
  },
  deleteMenuItem: (itemId) => {
    const merchantId = getMerchantIdOrThrow();
    return apiClient.delete(`/api/merchant/${merchantId}/menu/${itemId}`);
  },
  updateMenuItemsStatus: (itemIds, available) => {
    const merchantId = getMerchantIdOrThrow();
    return apiClient.patch(`/api/merchant/${merchantId}/menu/batch-status`, {
      itemIds, available,
    });
  },

  // 套餐
  getSetMenus: () => {
    const merchantId = getMerchantIdOrThrow();
    return apiClient.get(`/api/merchant/${merchantId}/setmenu`);
  },
  getSetMenu: (setMenuId) => {
    const merchantId = getMerchantIdOrThrow();
    return apiClient.get(`/api/merchant/${merchantId}/setmenu/${setMenuId}`);
  },
  createSetMenu: (formData) => {
    const merchantId = getMerchantIdOrThrow();
    return apiClient.post(`/api/merchant/${merchantId}/setmenu`, formData);
  },
  updateSetMenu: (setMenuId, formData) => {
    const merchantId = getMerchantIdOrThrow();
    return apiClient.put(`/api/merchant/${merchantId}/setmenu/${setMenuId}`, formData);
  },
  deleteSetMenu: (setMenuId) => {
    const merchantId = getMerchantIdOrThrow();
    return apiClient.delete(`/api/merchant/${merchantId}/setmenu/${setMenuId}`);
  },

  // 認證 / 商家資料
  merchantLogin: (credentials) => apiClient.post('/api/merchant/auth/login', credentials),
  merchantLogout: () => apiClient.post('/api/merchant/auth/logout'),
  verifyMerchantToken: () => apiClient.get('/api/merchant/auth/verify'),
  merchantRegister: (data) => apiClient.post('/api/merchant/auth/register', data),
  getMerchantProfile: () => {
    const merchantId = getMerchantIdOrThrow();
    return apiClient.get(`/api/merchant/${merchantId}/profile`);
  },
  updateMerchantProfile: (profileData) => {
    const merchantId = getMerchantIdOrThrow();
    return apiClient.put(`/api/merchant/${merchantId}/profile`, profileData);
  },

  // 訂單
  getMerchantOrders: (params = {}) => {
    const merchantId = getMerchantIdOrThrow();
    const qs = new URLSearchParams(params).toString();
    return apiClient.get(`/api/merchant/${merchantId}/orders${qs ? '?' + qs : ''}`);
  },
  getTodayOrders: () => {
    const merchantId = getMerchantIdOrThrow();
    return apiClient.get(`/api/merchant/orders/today/${merchantId}`);
  },
  updateOrderStatus: (orderId, status) => {
    const merchantId = getMerchantIdOrThrow();
    return apiClient.patch(`/api/merchant/orders/${orderId}/status`, { status, merchantId });
  },
  getOrderStats: (date = null) => {
    const merchantId = getMerchantIdOrThrow();
    const params = date ? { date } : {};
    return apiClient.get(`/api/merchant/orders/stats/${merchantId}`, { params });
  },
  getOrderById: (orderId) => {
    const merchantId = getMerchantIdOrThrow();
    return apiClient.get(`/api/merchant/orders/${orderId}`, { params: { merchantId } });
  },
  getOrdersByDateRange: (startDate, endDate) => {
    const merchantId = getMerchantIdOrThrow();
    return apiClient.get(`/api/merchant/orders/range/${merchantId}`, { params: { startDate, endDate } });
  },
  getOrdersByStatus: (status) => {
    const merchantId = getMerchantIdOrThrow();
    return apiClient.get(`/api/merchant/orders/status/${status}/${merchantId}`);
  },

  // 商家狀態 / 儀表板
  getMerchantStatus: () => {
    const merchantId = getMerchantIdOrThrow();
    return apiClient.get(`/api/merchant/${merchantId}/status`);
  },
  updateMerchantStatus: (statusData) => {
    const merchantId = getMerchantIdOrThrow();
    return apiClient.put(`/api/merchant/${merchantId}/status`, statusData);
  },
  getMerchantDashboard: (dateRange = {}) => {
    const merchantId = getMerchantIdOrThrow();
    const qs = new URLSearchParams(dateRange).toString();
    return apiClient.get(`/api/merchant/${merchantId}/dashboard${qs ? '?' + qs : ''}`);
  },
  getSalesReport: (params = {}) => {
    const merchantId = getMerchantIdOrThrow();
    const qs = new URLSearchParams(params).toString();
    return apiClient.get(`/api/merchant/${merchantId}/reports/sales${qs ? '?' + qs : ''}`);
  },

  // 取得營業排程
  getSchedule: (merchantId) =>
    apiClient.get(`/api/merchant/schedule/${merchantId}`),

  // 更新營業排程（body = { schedule, timezone }）
  updateSchedule: (merchantId, payload) =>
    apiClient.put(`/api/merchant/schedule/${merchantId}`, payload),

  // 檢查當前營業狀態
  checkStatus: (merchantId) =>
    apiClient.get(`/api/merchant/schedule/${merchantId}/status`),

  // 一週營業概況
  getWeeklyOverview: (merchantId) =>
    apiClient.get(`/api/merchant/schedule/${merchantId}/overview`),

  // 上傳
  uploadMerchantLogo: (logoFile) => {
    const merchantId = getMerchantIdOrThrow();
    const formData = new FormData();
    formData.append('logo', logoFile);
    return apiClient.post(`/api/merchant/${merchantId}/upload/logo`, formData);
  },
  uploadMenuItemImage: (itemId, imageFile) => {
    const formData = new FormData();
    formData.append('image', imageFile);
    return apiClient.post(`/api/merchant/menu/${itemId}/upload/image`, formData);
  },

  // 工具
  getImageUrl: (imagePath) => {
    if (!imagePath) return null;
    if (imagePath.startsWith('http')) return imagePath;
    const prefix = imagePath.startsWith('/') ? '' : '/';
    return `${API_BASE_URL}${prefix}${imagePath}`;
  },
  handleApiError: (error) => {
    if (error.response) {
      const { status, data } = error.response;
      switch (status) {
        case 400: return data.message || '請求參數錯誤';
        case 401: return '未授權，請重新登入';
        case 403: return '權限不足';
        case 404: return '資源不存在';
        case 422: return data.message || '資料驗證失敗';
        case 500: return '伺服器內部錯誤';
        default:  return data.message || '發生未知錯誤';
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