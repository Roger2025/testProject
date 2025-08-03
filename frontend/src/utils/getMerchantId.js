// src/utils/getMerchantId.js
import { devFlags } from '../constants/devFlags';

/**
 * 取得要用的 merchantId（優先真實、有的話 fallback 開發用）。
 * @param {string|null|undefined} authMerchantId - 來自登入狀態的 merchantId
 * @returns {string|null} 最終生效的 merchantId，沒有則回 null
 */
export function getEffectiveMerchantId(authMerchantId) {
  if (authMerchantId) return authMerchantId;
  if (devFlags.bypassAuth) {
    return process.env.REACT_APP_DEFAULT_MERCHANT || 'default_merchant';
  }
  return null;
}