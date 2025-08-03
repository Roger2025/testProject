export function getFullImageUrl(imageUrl) {
  if (!imageUrl) return null;
  if (imageUrl.startsWith('http')) return imageUrl;

  let base = process.env.REACT_APP_API_URL || 'http://localhost:3001';
  // 去掉尾端的 slash（避免 double slash）
  base = base.replace(/\/+$/, '');
  // 確保 imageUrl 以一個 slash 開頭
  const path = imageUrl.startsWith('/') ? imageUrl : `/${imageUrl}`;
  return `${base}${path}`;
}