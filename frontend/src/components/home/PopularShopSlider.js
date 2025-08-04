// src/components/home/PopularShopSlider.js（單個滑動元件）
import React, { useRef } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import CarouselNav from '../common/CarouselNav';  
import { Link } from 'react-router-dom';

const PopularShopSlider = ({ shops, sliderSettings }) => {
  const sliderRef = useRef(null);

  return (
    <div className="slider-row">
      <CarouselNav
        onPrevClick={() => sliderRef.current?.slickPrev()}
        side="left"
      />
      <div className="slider-container">
      <Slider ref={sliderRef} {...sliderSettings}>
        {shops.map((cat, index) => (
          <div key={index}>
          {/* <a href={cat.url} style={{ textDecoration: 'none', color: 'inherit' }}>  */}
          {/* <a href={cat.url}>  */}
            <Link to={cat.url} style={{ textDecoration: 'none' , color: 'inherit' }}>
            {/* <Link to={cat.url}> */}
            {/* 使用 Link 來實現 React Router 的導航 */}
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

export default PopularShopSlider;