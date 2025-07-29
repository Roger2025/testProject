// services/merchantApi.js
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

// 創建 axios 實例
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 請求攔截器 - 添加認證token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('merchantToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 響應攔截器 - 處理錯誤
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token 過期或無效，清除本地存儲並重定向到登入頁
      localStorage.removeItem('merchantToken');
      localStorage.removeItem('merchantId');
      window.location.href = '/merchant/login';
    }
    return Promise.reject(error);
  }
);

// 菜單相關 API
export const merchantApi = {
  // 獲取商家菜單列表
  getMenuItems: (merchantId) => {
    return apiClient.get(`/api/merchant/${merchantId}/menu`);
  },

  // 獲取單個菜單項目
  getMenuItem: (merchantId, itemId) => {
    return apiClient.get(`/api/merchant/${merchantId}/menu/${itemId}`, {
      headers: {
        'Cache-Control': 'no-cache'  // 關閉 axios 的快取以避免 304（開發中使用)
      }
    });
  },

  // 創建菜單項目
  createMenuItem: (formData) => {
    return apiClient.post('/api/merchant/menu', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  // 更新菜單項目
  updateMenuItem: (itemId, formData) => {
    return apiClient.put(`/api/merchant/menu/${itemId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  // 刪除菜單項目
  deleteMenuItem: (itemId) => {
    return apiClient.delete(`/api/merchant/menu/${itemId}`);
  },

  // 批量更新菜單項目狀態
  updateMenuItemsStatus: (merchantId, itemIds, available) => {
    return apiClient.patch(`/api/merchant/${merchantId}/menu/batch-status`, {
      itemIds,
      available,
    });
  },

  // 套餐相關 API
  // 獲取商家套餐列表
  getSetMenus: (merchantId) => {
    return apiClient.get(`/api/merchant/${merchantId}/setmenu`);
  },

  // 獲取單個套餐
  getSetMenu: (merchantId, setMenuId) => {
    return apiClient.get(`/api/merchant/${merchantId}/setmenu/${setMenuId}`);
  },

  // 創建套餐
  createSetMenu: (formData) => {
    return apiClient.post('/api/merchant/setmenu', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  // 更新套餐
  updateSetMenu: (setMenuId, formData) => {
    return apiClient.put(`/api/merchant/setmenu/${setMenuId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  // 刪除套餐
  deleteSetMenu: (setMenuId) => {
    return apiClient.delete(`/api/merchant/setmenu/${setMenuId}`);
  },

  // 認證相關 API
  // 商家登入
  merchantLogin: (credentials) => {
    return apiClient.post('/api/merchant/auth/login', credentials);
  },

  // 商家登出
  merchantLogout: () => {
    return apiClient.post('/api/merchant/auth/logout');
  },

  // 驗證商家token
  verifyMerchantToken: () => {
    return apiClient.get('/api/merchant/auth/verify');
  },

  // 商家註冊
  merchantRegister: (merchantData) => {
    return apiClient.post('/api/merchant/auth/register', merchantData);
  },

  // 商家資料相關 API
  // 獲取商家資料
  getMerchantProfile: (merchantId) => {
    return apiClient.get(`/api/merchant/${merchantId}/profile`);
  },

  // 更新商家資料
  updateMerchantProfile: (merchantId, profileData) => {
    return apiClient.put(`/api/merchant/${merchantId}/profile`, profileData);
  },

  // 訂單相關 API
  // 獲取商家訂單
  getMerchantOrders: (merchantId, params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiClient.get(`/api/merchant/${merchantId}/orders${queryString ? '?' + queryString : ''}`);
  },

  // 更新訂單狀態
  updateOrderStatus: (orderId, status) => {
    return apiClient.patch(`/api/merchant/orders/${orderId}/status`, { status });
  },

  // 商家狀態相關 API
  // 獲取商家營業狀態
  getMerchantStatus: (merchantId) => {
    return apiClient.get(`/api/merchant/${merchantId}/status`);
  },

  // 更新商家營業狀態
  updateMerchantStatus: (merchantId, statusData) => {
    return apiClient.put(`/api/merchant/${merchantId}/status`, statusData);
  },

  // 統計數據相關 API
  // 獲取商家儀表板數據
  getMerchantDashboard: (merchantId, dateRange = {}) => {
    const queryString = new URLSearchParams(dateRange).toString();
    return apiClient.get(`/api/merchant/${merchantId}/dashboard${queryString ? '?' + queryString : ''}`);
  },

  // 獲取銷售報告
  getSalesReport: (merchantId, params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiClient.get(`/api/merchant/${merchantId}/reports/sales${queryString ? '?' + queryString : ''}`);
  },

  // 檔案上傳相關 API
  // 上傳商家Logo
  uploadMerchantLogo: (merchantId, logoFile) => {
    const formData = new FormData();
    formData.append('logo', logoFile);
    return apiClient.post(`/api/merchant/${merchantId}/upload/logo`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  // 上傳餐點圖片
  uploadMenuItemImage: (itemId, imageFile) => {
    const formData = new FormData();
    formData.append('image', imageFile);
    return apiClient.post(`/api/merchant/menu/${itemId}/upload/image`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  // 工具方法
  // 獲取圖片URL
  getImageUrl: (imagePath) => {
    if (!imagePath) return null;
    if (imagePath.startsWith('http')) return imagePath;
    return `${API_BASE_URL}/${imagePath}`;
  },

  // 處理API錯誤
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

  // 重試機制
  retry: async (apiCall, maxRetries = 3, delay = 1000) => {
    for (let i = 0; i < maxRetries; i++) {
      try {
        return await apiCall();
      } catch (error) {
        if (i === maxRetries - 1) throw error;
        
        // 如果是網路錯誤或5xx錯誤，則重試
        if (!error.response || error.response.status >= 500) {
          await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, i)));
        } else {
          throw error;
        }
      }
    }
  }
};

export default merchantApi;