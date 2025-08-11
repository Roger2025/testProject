// src/components/home/PopularShopSlider.js（單個滑動元件）

import React, { forwardRef, useRef } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import CarouselNav from '../common/CarouselNav';  
import { Link } from 'react-router-dom';
// import '../../styles/css/ProductDiscount.css'; // 放自訂樣式 可放 Ogani 原樣式
// import IconButton from '../common/IconButton';


const PopularShopSlider = forwardRef(({ shops, sliderSettings }, ref) => {
  const localRef = useRef(null);

  // 若 ref 為外部傳入，就使用外部的；否則使用本地的
  const sliderInstance = ref || localRef;

  return (
    <div className="product__discount">
      <div className="section-title product__discount__title">
        <h2>熱門早餐店</h2>
      </div>
      <div className="row">
        <div className="slider-row">
          <CarouselNav
            onPrevClick={() => sliderInstance.current?.slickPrev()}
            side="left"
          />
            <div className="slider-container">
              <Slider ref={sliderInstance} {...sliderSettings}>
                {Array.isArray(shops) && shops.length > 0 &&
                shops.map((cat, index) => (
                  <div className="product__item" key={index}>
                    <Link to={cat.url} style={{ textDecoration: 'none' , color: 'inherit' }}>
                      <div
                        className="product__item__pic set-bg"
                        style={{
                          backgroundImage: `url(${cat.img})`
                        }}
                        role="img"
                        aria-label={cat.name}
                      >
                        <ul className="product__item__pic__hover">
                          <li><a href="#"><i className="fa fa-heart"></i></a></li>
                          <li><a href="#"><i className="fa fa-retweet"></i></a></li>
                          <li><a href="#"><i className="fa fa-shopping-cart"></i></a></li>
                          {/* <li>
                            <button className="icon-button" aria-label="加入收藏">
                              <i className="fa fa-heart" aria-hidden="true"></i>
                            </button>
                          </li>
                          <li>
                            <button className="icon-button" aria-label="加入比較清單">
                              <i className="fa fa-retweet" aria-hidden="true"></i>
                            </button>
                          </li>
                          <li>
                            <button className="icon-button" aria-label="加入購物車">
                              <i className="fa fa-shopping-cart" aria-hidden="true"></i>
                            </button>
                          </li> */}
                            {/* <li>
                              <IconButton iconClass="fa fa-heart" label="加入收藏" onClick={() => handleFavorite(product)} />
                            </li>
                            <li>
                              <IconButton iconClass="fa fa-retweet" label="加入比較清單" onClick={() => handleCompare(product)} />
                            </li>
                            <li>
                              <IconButton iconClass="fa fa-shopping-cart" label="加入購物車" onClick={() => handleAddToCart(product)} />
                            </li> */}
                        </ul>                  
                      </div>
                      <div className="product__item__text">
                      <h6>{cat.name}</h6>
                      </div>
                    </Link>
                  </div>
                ))}
              </Slider> 
            </div>
          <CarouselNav
            onNextClick={() => sliderInstance.current?.slickNext()}
            side="right"
          />
        </div>
      </div>
    </div>
  );
});

export default PopularShopSlider;