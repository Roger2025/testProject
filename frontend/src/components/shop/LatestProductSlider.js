// ogani : shop-grid.html :　Pduct Section（第1-5部分）
// LatestProductSlider.js
// Path = components/shop/

// 安裝輪播套件（建議使用 Swiper）npm install swiper
// LatestProductSlider.js 元件程式碼範例（使用 Swiper）

import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import '../../styles/latestProductSlider.css'; // 可放 Ogani 樣式或自訂

const latestProducts = [
  {
    id: 1,
    name: 'Crab Pool Security',
    price: '$30.00',
    img: '/assets/ogani/img/latest-product/lp-1.jpg',
  },
  {
    id: 2,
    name: 'Crab Pool Security',
    price: '$30.00',
    img: '/assets/ogani/img/latest-product/lp-2.jpg',
  },
  {
    id: 3,
    name: 'Crab Pool Security',
    price: '$30.00',
    img: '/assets/ogani/img/latest-product/lp-3.jpg',
  },
  // 可再加更多商品
];

const LatestProductSlider = () => {
  return (
    <div className="sidebar__item">
      <div className="latest-product__text">
        <h4>Latest Products</h4>
        <Swiper
          spaceBetween={10}
          slidesPerView={1}
          navigation
        >
          {[0, 1].map((groupIndex) => (
            <SwiperSlide key={groupIndex}>
              <div className="latest-prdouct__slider__item">
                {latestProducts.map((item) => (
                  <a
                    href="#"
                    key={item.id}
                    className="latest-product__item"
                  >
                    <div className="latest-product__item__pic">
                      <img src={item.img} alt={item.name} />
                    </div>
                    <div className="latest-product__item__text">
                      <h6>{item.name}</h6>
                      <span>{item.price}</span>
                    </div>
                  </a>
                ))}
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default LatestProductSlider;