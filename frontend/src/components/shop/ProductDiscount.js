// ogani : shop-grid.html :　Pduct Section（第2-1～第2-2部分）
// ProductDiscount.js
// Path = components/shop/

// 安裝 Swiper：npm install swiper

import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
// import '../../styles/css/productDiscount.css'; // 可放 Ogani 原樣式

const discountProducts = [
  {
    id: 1,
    category: 'Dried Fruit',
    name: 'Raisin’n’nuts',
    price: 30.0,
    oldPrice: 36.0,
    percent: '-20%',
    img: '/assets/ogani/img/product/discount/pd-1.jpg',
  },
  {
    id: 2,
    category: 'Vegetables',
    name: 'Vegetables’package',
    price: 30.0,
    oldPrice: 36.0,
    percent: '-20%',
    img: '/assets/ogani/img/product/discount/pd-2.jpg',
  },
  {
    id: 3,
    category: 'Dried Fruit',
    name: 'Mixed Fruitss',
    price: 30.0,
    oldPrice: 36.0,
    percent: '-20%',
    img: '/assets/ogani/img/product/discount/pd-3.jpg',
  },
  // 更多商品...
];

const ProductDiscount = () => {
  return (
    <div className="product__discount">
      <div className="section-title product__discount__title">
        <h2>Sale Off</h2>
      </div>
      <div className="row">
        <div className="product__discount__slider">
          <Swiper spaceBetween={10} slidesPerView={3}>
            {discountProducts.map((item) => (
              <SwiperSlide key={item.id}>
                <div className="product__discount__item">
                  <div
                    className="product__discount__item__pic"
                    style={{
                      backgroundImage: `url(${item.img})`,
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
            ))}
          </Swiper>
        </div>
      </div>
    </div>
  );
};

export default ProductDiscount;