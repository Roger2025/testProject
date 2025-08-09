// src/utils/getMerchantId.js
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