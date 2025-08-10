// src/hooks/useMerchantId.js
import { useSelector } from 'react-redux';
import { getEffectiveMerchantId } from '../utils/getMerchantId';

/**
 * 從 Redux store 取得 merchantId（自動兼容開發模式）
 */
export function useMerchantId() {
  const authMerchantId = useSelector(
    (state) => state.merchantAuth?.merchant?.merchantId || null
  );
  return getEffectiveMerchantId(authMerchantId);
}