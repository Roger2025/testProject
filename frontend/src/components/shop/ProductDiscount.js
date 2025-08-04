// ogani: shop-grid.html - Pduct Section（第2-1～第2-2部分）
// src/components/shop/ProductDiscount.js
// 安裝 Swiper：npm install swiper
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import { Navigation, Autoplay } from 'swiper/modules';
import 'swiper/css/navigation';
import '../../styles/css/ProductDiscount.css'; // 放自訂樣式 可放 Ogani 原樣式

// 使用 imageMap.js 來獲取圖片路徑
// import { imageMap } from '../../utils/discount/imageMap'; // 使用 discount 資料夾的映射
// import { imageMap } from '../../utils/imageMaptest'; // 使用 imageMaptest.js 測試

// import { imageRegistry, getImageURL } from '../../utils/imageRegistry';
// const { discount: imageMap } = imageRegistry; // 從 imageRegistry 中獲取 discount 映射
// 例如：const imageURL = getImageURL('discount/pd-1.jpg'); // 獲取特定圖片的 URL
// 這樣可以保持圖片路徑的統一性和可維護性

// 透過後端 Node.js /public/images/ 下載圖片
// 必須先打開 Node.js 伺服器 localhost:3001/images/merchant1/discount/
// 這樣可以避免使用 require.context 和 imageMap
export const getImageURL = (modulePath) => {
  return `http://localhost:3001/images/merchant1/${modulePath}`;
};

const discountProducts = [
  {
    id: 1,
    category: 'burgers',
    name: '麥香雞堡',
    price: 32.0,
    oldPrice: 40.0,
    percent: '-20%',
    img: 'burgers/burgers07.jpg',
  },
  {
    id: 2,
    category: 'toast',
    name: '麥香雞吐司',
    price: 28.0,
    oldPrice: 35.0,
    percent: '-20%',
    img: 'toast/toast06.jpg',
  },
  {
    id: 3,
    category: 'omelettes',
    name: '培根蛋餅',
    price: 44.0,
    oldPrice: 55.0,
    percent: '-20%',
    img: 'omelettes/omelettes04.jpg',
  },
  {
    id: 4,
    category: 'pasta',
    name: '磨菇麵',
    price: 40.0,
    oldPrice: 50.0,
    percent: '-20%',
    img: 'pasta/pasta01.jpg',
  },
  {
    id: 5,
    category: 'single',
    name: '雞塊',
    price: 32.0,
    oldPrice: 40.0,
    percent: '-20%',
    img: 'single/single05.jpg',
  },
  {
    id: 6,
    category: 'drinks',
    name: '豆漿',
    price: 16.0,
    oldPrice: 20.0,
    percent: '-20%',
    img: 'drinks/drinks04.jpg',
  },  
  {
    id: 7,
    category: 'salad',
    name: '地瓜沙拉',
    price: 40.0,
    oldPrice: 50.0,
    percent: '-20%',
    img: 'salad/salad02.jpg',
  },
  // 更多商品...
];

const ProductDiscount = () => {
  return (
    <div className="product__discount">
      <div className="section-title product__discount__title">
        <h2>優惠專區</h2>
      </div>
      <div className="row">
        <div className="product__discount__slider">
          <Swiper 
          modules={[Navigation, Autoplay]}
          spaceBetween={10} 
          slidesPerView={3}
          autoplay={{ delay: 3000, disableOnInteraction: false }}
          navigation
          breakpoints={{
            640: {
              slidesPerView: 1,
            },
            768: {
              slidesPerView: 2,
            },
            1024: {
              slidesPerView: 3,
            },
          }}
          >
            {discountProducts.map((item) => {
              // 使用 getImageURL 函數來獲取圖片的 URL
              // const imageURL = getImageURL(`discount/${item.img}`); // 獲取特定圖片的 URL 
              // 這樣可以保持圖片路徑的統一性和可維護性
              // 例如：const imageURL = getImageURL('discount/pd-1.jpg'); // 獲取特定圖片的 URL 
              // const imageURL = getImageURL(`discount/${item.img}`); // 獲取特定圖片的 URL       
              const imageURL = getImageURL(item.img); // item.img = 'discount01.jpg'        
              return (
              <SwiperSlide key={item.id}>
                <div className="product__discount__item">
                  <div
                    className="product__discount__item__pic"
                    style={{
                      // backgroundImage: `url(${imageMap[item.img]})`, // 使用 imageMap[item.img] 來獲取圖片的實際路徑
                      backgroundImage: `url(${imageURL})`, // 獲取特定圖片的 URL  
                      backgroundSize: 'cover',
                    }}
                  >
                    <div className="product__discount__percent">{item.percent}</div>
                    <ul className="product__item__pic__hover">
                      <li><a href="#"><i className="fa fa-heart"></i></a></li>
                      <li><a href="#"><i className="fa fa-retweet"></i></a></li>
                      <li><a href="#"><i className="fa fa-shopping-cart"></i></a></li>
                    </ul>
                  </div>
                  <div className="product__discount__item__text">
                    <span>{item.category}</span>
                    <h5><a href="#">{item.name}</a></h5>
                    <div className="product__item__price">
                      ${item.price.toFixed(2)} <span>${item.oldPrice.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
              );
            })}
          </Swiper>
        </div>
      </div>
    </div>
  );
};

export default ProductDiscount;