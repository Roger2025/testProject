// src/components/home/PopularShopSlider.js（單個滑動元件）

import React, { forwardRef, useRef } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import CarouselNav from '../common/CarouselNav';  
import { Link } from 'react-router-dom';

const PopularShopSlider = forwardRef(({ shops, sliderSettings }, ref) => {
  const localRef = useRef(null);

  // 若 ref 為外部傳入，就使用外部的；否則使用本地的
  const sliderInstance = ref || localRef;

  return (
    <div className="slider-row">
      <CarouselNav
        onPrevClick={() => sliderInstance.current?.slickPrev()}
        side="left"
      />
      <div className="slider-container">
        <Slider ref={sliderInstance} {...sliderSettings}>
          {Array.isArray(shops) && shops.length > 0 &&
          shops.map((cat, index) => (
            <div key={index}>
              <Link to={cat.url} style={{ textDecoration: 'none' , color: 'inherit' }}>
                <div
                  className="categories__item"
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
                  <h5>{cat.name}</h5>
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
  );
});

export default PopularShopSlider;