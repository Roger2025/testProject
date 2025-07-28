// frontend/src/utils/discount/imageMap.js
// for mapping image paths to their actual imports
// for use in components like components/shop/ProductDiscount.js

const images = require.context('../../assets/images/product/discount', false, /\.(png|jpe?g|svg)$/);

export const imageMap = images.keys().reduce((map, path) => {
  const fileName = path.replace('./', ''); // 移除 './'
  map[fileName] = images(path); // 加入映射
  return map;
}, {});