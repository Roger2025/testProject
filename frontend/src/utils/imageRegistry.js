import { imageMap as discountImageMap } from './discount/imageMap';
// import { hotImageMap } from './hot/imageMap';

export const imageRegistry = {
  discount: discountImageMap,
//   hot: hotImageMap,
  // 更多模組請往下擴充
};

export const getImageURL = (modulePath) => {
  const [mod, filename] = modulePath.split('/');
  return imageRegistry[mod]?.[filename];
};
// 如果需要動態載入其他模組的圖片，可以在這裡擴充
// 例如：   
// export const hotImageMap = require('./hot/imageMap').hotImageMap;
// export const anotherImageMap = require('./another/imageMap').anotherImageMap;
// 這樣可以在其他組件中使用 imageRegistry 來獲取圖片路徑
// 例如：
// const { discount: imageMap } = imageRegistry; // 從 imageRegistry 中獲取 discount 映射
// const imageURL = getImageURL('discount/pd-1.jpg'); // 獲取特定圖片的 URL
// 這樣可以保持圖片路徑的統一性和可維護性