// src/utils/CategoryParser.js

// 檢查並轉換字串型的陣列
export function parseCategoryField(rawCategory) {
  try {
    if (Array.isArray(rawCategory)) {
      // 如果陣列第一個元素是字串且看起來像陣列
      const first = rawCategory[0];
      if (typeof first === 'string' && first.match(/\[\s*['"]/)) {
        // 移除多餘逗號並處理引號 → 嘗試解析
        const cleaned = first
          .replace(/,\s*\]/, ']')   // 尾端逗號清除
          .replace(/'/g, '"');      // 換成雙引號
        const parsed = JSON.parse(cleaned);
        return Array.isArray(parsed) ? parsed : [];
      }
      return rawCategory; // 已是合法陣列
    }
    // ✅ 是字串型陣列
    if (typeof rawCategory === 'string' && rawCategory.startsWith('[')) {
      const cleaned = rawCategory
        .replace(/,\s*\]/, ']')
        .replace(/'/g, '"');
      const parsed = JSON.parse(cleaned);
      return Array.isArray(parsed) ? parsed : [];
    }
    // ❌ 無法解析
    return []; // 無法解析
  } catch (err) {
    console.warn('分類解析失敗:', rawCategory);
    return [];
  }
};
