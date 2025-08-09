// src/utils/getMerchantId.js
import axios from 'axios';
import { devFlags } from '../constants/devFlags';

/**
 * 驗證是否為合法 ObjectId（MongoDB 預設 24 字元 hex）
 */
export function isValidObjectId(id) {
  return typeof id === 'string' && /^[a-f\d]{24}$/i.test(id);
}

/**
 * 開發模式下使用 fallback merchantId
 */
export function getFallbackMerchantId() {
  console.warn('[開發模式] 使用 fallback merchantId');
  return process.env.REACT_APP_DEFAULT_MERCHANT || '662f41ac1234567890abcde1';
}

/**
 * 從 Redux 或傳入值取得最終生效的 merchantId
 * @param {string|null|undefined} authMerchantId
 */
export function getEffectiveMerchantId(authMerchantId) {
  if (isValidObjectId(authMerchantId)) {
    return authMerchantId;
  }

  if (devFlags.bypassAuth) {
    return getFallbackMerchantId();
  }

  return null;
}

/**
 * 非同步：從 API 擷取登入使用者資訊，回傳 merchantId 與 role
 * @returns {Promise<{ merchantId: string | null, role: string | null }>}
 */
export async function fetchMerchantInfoFromSession() {
  try {
    const res = await axios.get('/api/auth/loin', {
      withCredentials: true, // 確保 cookie 傳送
    });

    const user = res?.user || null;

    if (user?.merchantId && user.role === 'merchant') {
      const merchantIdStr = user.merchantId.toString?.() || String(user.merchantId);
      return {
        merchantId: isValidObjectId(merchantIdStr) ? merchantIdStr : null,
        role: user.role,
      };
    }

    console.warn('未取得 merchant 身份或 merchantId 無效');
    return { merchantId: null, role: user?.role || null };
  } catch (error) {
    console.error('取得 session 使用者資訊失敗:', error);
    return { merchantId: null, role: null };
  }
}