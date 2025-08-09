// src/utils/parseShopData.js
// 支援「會員資料」或「混合型資料
export function parseShopData(raw, type = 'shop') {
  const arr = Array.isArray(raw?.shops)
    ? raw.shops
    : Array.isArray(raw)
      ? raw
      : [];

  if (type === 'shop') {
    return arr.filter(item => typeof item.storeName === 'string' && item.storeName.trim() !== '');
  }

  if (type === 'member') {
    return arr.filter(item => typeof item.member_ID === 'string');
  }

  return arr;
}