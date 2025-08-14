// src/hooks/useMerchantId.js
import { useSelector } from 'react-redux';

export const useMerchantId = () =>
  useSelector((s) => s.merchantAuth.user?.merchantId ?? null);

export default useMerchantId;