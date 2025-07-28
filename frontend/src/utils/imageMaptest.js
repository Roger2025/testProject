// utils/imageMap.js
// for mapping image paths to their actual imports
// for use in components like components/shop/ProductDiscount.js

// src/utils/imageMap.js
const images = require.context('../assets/images/product/discount', false, /\.(png|jpe?g|svg)$/);

export const imageMap = images.keys().reduce((map, path) => {
  // path 例如 './pd-1.jpg'
  const fileName = path.replace('./', ''); // 移除 './'
  map[fileName] = images(path); // 加入映射
  return map;
}, {});
// 這樣可以直接使用 imageMap['pd-1.jpg'] 來獲取圖片的實際路徑


// 方法一: 無效果
// export const imageMap = {
//   'pd-1.jpg': require('../../assets/images/product/discount/pd-1.jpg'),
//   'pd-2.jpg': require('../../assets/images/product/discount/pd-2.jpg'),
//   'pd-3.jpg': require('../../assets/images/product/discount/pd-3.jpg'),
//   '../../assets/images/product/discount/pd-4.jpg': require('../../assets/images/product/discount/pd-4.jpg'),
//   '../../assets/images/product/discount/pd-5.jpg': require('../../assets/images/product/discount/pd-5.jpg'),
//   '../../assets/images/product/discount/pd-6.jpg': require('../../assets/images/product/discount/pd-6.jpg'),
//   // 加入所有可能用到的圖片
// };


