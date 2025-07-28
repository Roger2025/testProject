// CategoriesSlider.jsx（單個滑動元件）

import React, { useRef } from 'react';
import Slider from 'react-slick';
import CarouselNav from './CarouselNav';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const CategoriesSlider = ({ categories, sliderSettings }) => {
  const sliderRef = useRef(null);

  return (
    <div className="slider-row">
      <CarouselNav
        onPrevClick={() => sliderRef.current?.slickPrev()}
        side="left"
      />
      <div className="slider-container">
      <Slider ref={sliderRef} {...sliderSettings}>
        {categories.map((cat, index) => (
          <div key={index}>
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
              }}
            >
              <h5><a href="#">{cat.title}</a></h5>
            </div>
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

export default CategoriesSlider;