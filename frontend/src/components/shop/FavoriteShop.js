// ogani : shop-grid.html :　Pduct Section（第2-1～第2-2部分）
// FavoriteShop.js is modified from ProductDiscount.js
// Path = components/shop/

// 安裝 Swiper：npm install swiper

import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import '../../styles/css/ProductDiscount.css'; // 放自訂樣式 可放 Ogani 原樣式
import { Navigation, Autoplay } from 'swiper/modules';
import 'swiper/css/navigation';

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
  return `http://localhost:3001/images/${modulePath}`;
};

const FavoriteShopList = [
    { title: '早餐店1', img: getImageURL('merchant01.jpg'), url: '/shop1', category: ['Open','OnlinePay']  },
    { title: '早餐店2', img: getImageURL('merchant02.jpg'), url: '/shoptest', category: ['Open','OnlinePay']  },
    { title: '早餐店3', img: getImageURL('merchant03.jpg'), url: '/shoptest', category: ['Open','OnlinePay']  },
    { title: '早餐店4', img: getImageURL('merchant04.jpg'), url: '/shoptest', category: ['Open','OnlinePay']  },
    { title: '早餐店5', img: getImageURL('merchant05.jpg'), url: '/shoptest', category: ['Open','OnlinePay']  },
    { title: '早餐店6', img: getImageURL('merchant06.jpg'), url: '/shoptest', category: ['Open','OnlinePay']  },
    { title: '早餐店7', img: getImageURL('merchant07.jpg'), url: '/shoptest', category: ['Open','OnlinePay']  },
    { title: '早餐店8', img: getImageURL('merchant08.jpg'), url: '/shoptest', category: ['Open','OnlinePay']  },
    { title: '早餐店9', img: getImageURL('merchant09.jpg'), url: '/shoptest', category: ['Open','OnlinePay']  },
    { title: '早餐店10', img: getImageURL('merchant10.jpg'), url: '/shoptest', category: ['Open','OnlinePay']  }, 
  // 更多店家...
];

const FavoriteShop = () => {
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
            {FavoriteShopList.map((item, index) => {
              // 使用 getImageURL 函數來獲取圖片的 URL
              // const imageURL = getImageURL(`discount/${item.img}`); // 獲取特定圖片的 URL 
              // 這樣可以保持圖片路徑的統一性和可維護性
              // 例如：const imageURL = getImageURL('discount/pd-1.jpg'); // 獲取特定圖片的 URL 
              // const imageURL = getImageURL(`discount/${item.img}`); // 獲取特定圖片的 URL       
              // const imageURL = getImageURL(item.img); // item.img = 'discount01.jpg'  
              const imageURL = item.img; // item.img = 'discount01.jpg'        
              return (
              <SwiperSlide key={index}>
                <div className="product__discount__item">
                  <div
                    className="product__discount__item__pic"
                    style={{
                      // backgroundImage: `url(${imageMap[item.img]})`, // 使用 imageMap[item.img] 來獲取圖片的實際路徑
                      backgroundImage: `url(${imageURL})`, // 獲取特定圖片的 URL  
                      backgroundSize: 'cover',
                    }}
                  >
                    {/* <div className="product__discount__percent">{item.percent}</div> */}
                    {/* <ul className="product__item__pic__hover">
                      <li><a href="#"><i className="fa fa-heart"></i></a></li>
                      <li><a href="#"><i className="fa fa-retweet"></i></a></li>
                      <li><a href="#"><i className="fa fa-shopping-cart"></i></a></li>
                    </ul> */}
                  </div>
                  <div className="product__discount__item__text">
                    {/* <span>{item.category}</span> */}
                    <h5><a href="#">{item.title}</a></h5>
                    {/* <div className="product__item__price">
                      ${item.price.toFixed(2)} <span>${item.oldPrice.toFixed(2)}</span>
                    </div> */}
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

export default FavoriteShop
;