// src/components/shop/ProductLogoutSlider.js（未登入-單個滑動元件）

import React, { useRef } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import CarouselNav from '../common/CarouselNav';  
import { Link } from 'react-router-dom';

const ProductLogoutSlider = ({ Products, sliderSettings }) => {
  const sliderRef = useRef(null);

  return (
    <div className="slider-row">
      <CarouselNav
        onPrevClick={() => sliderRef.current?.slickPrev()}
        side="left"
      />
      <div className="slider-container">
      <Slider ref={sliderRef} {...sliderSettings}>
        {Products.map((cat, index) => (
          <div className="product__discount__item" key={index}>
          {/* <a href={cat.url} style={{ textDecoration: 'none', color: 'inherit' }}>  */}
          {/* <a href={cat.url}>  */}
            <Link to={cat.url} style={{ textDecoration: 'none' , color: 'inherit' }}>
            {/* <Link to={cat.url}> */}
            {/* 使用 Link 來實現 React Router 的導航 */}
            <div
              className="product__discount__item__pic"
              style={{
                backgroundImage: `url(${cat.img})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                height: '200px',
                display: 'flex',
                alignItems: 'flex-end',
                justifyContent: 'center',
                cursor: 'pointer',
              }}
            >
              <div className="product__discount__percent">{cat.percent}</div>
              <ul className="product__item__pic__hover">
                <li><a href="#"><i className="fa fa-heart"></i></a></li>
                <li><a href="#"><i className="fa fa-retweet"></i></a></li>
                <li><a href="#"><i className="fa fa-shopping-cart"></i></a></li>
              </ul>
            </div>

            <div className="product__discount__item__text">
              <span>{cat.category}</span>
              <h5><a href="#">{cat.name}</a></h5>
              <div className="product__item__price">
                ${cat.price.toFixed(2)} <span>${cat.oldPrice.toFixed(2)}</span>
              </div>
            </div>
            
            </Link>
            {/* </a>  */}
          </div>
        ))}
      </Slider>
      </div>
      <CarouselNav
        onNextClick={() => sliderRef.current?.slickNext()}
        side="right"
      />
    </div>
  );
};

export default ProductLogoutSlider;