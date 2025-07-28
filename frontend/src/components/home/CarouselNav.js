// CarouselNav.js（左右按鈕元件）

import React from 'react';
// import './CarouselNav.css'; // 若有樣式可獨立管理

const CarouselNav = ({ onPrevClick, onNextClick, side }) => {
  if (side === 'left') {
    return (
      <button className="owl-prev" onClick={onPrevClick}>
        <span className="fa fa-angle-left"></span>
      </button>
    );
  }
  if (side === 'right') {
    return (
      <button className="owl-next" onClick={onNextClick}>
        <span className="fa fa-angle-right"></span>
      </button>
    );
  }
  return null;
};

export default CarouselNav;

