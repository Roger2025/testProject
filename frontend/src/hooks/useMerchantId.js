// src/hooks/useMerchantId.js
import { useState, useEffect } from 'react';
import { fetchMerchantInfoFromSession } from '../utils/getMerchantId';

/**
 * 自動從 session API 抓取 merchantId 並提供使用。
 * 建議在元件初始化階段呼叫。
 * @returns {string|null} merchantId 或 null（尚未取得）
 */
export function useMerchantId() {
  const [merchantId, setMerchantId] = useState(null);

  useEffect(() => {
    const fetchId = async () => {
      try {
        const id = await fetchMerchantInfoFromSession();
        setMerchantId(id);
      } catch (error) {
        console.error('取得 merchantId 失敗：', error);
        setMerchantId(null);
      }
    };

    fetchId();
  }, []);

  return merchantId;
}