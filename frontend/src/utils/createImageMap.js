// src/utils/createImageMap.js

// export const createImageMap = (path, deep = false) => {
//     // 使用 require.context 來動態載入圖片
//   const ctx = require.context(path, deep, /\.(png|jpe?g|svg)$/);
//   return ctx.keys().reduce((map, key) => {
//     const fileName = key.replace('./', '');
//     map[fileName] = ctx(key);
//     return map;
//   }, {});
// };

export const createImageMap = (path, deep = false) => {
//   path = path || '../assets/images/product/discount'; // 預設路徑  
  const images = require.context(path, deep, /\.(png|jpe?g|svg)$/);  
  return images.keys().reduce((map, path) => {
    // 使用 require.context 來動態載入圖片
    const fileName = path.replace('./', ''); // 移除 './'
    map[fileName] = images(path); // 加入映射
    return map;
}, {});
};
// 這樣可以直接使用 imageMap['pd-1.jpg'] 來獲取圖片的實際路徑