import React, { useRef } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import CarouselNav from './CarouselNav.js'; 
import CategoriesSlider from './CategoriesSlider';

// 類別資料清單，可從 API 或 props 傳入
const categories = [
  { title: '早餐店1', img: require('../../assets/images/categories/cat-1.jpg'), url: '/shop1' },
  { title: '早餐店2', img: require('../../assets/images/categories/cat-2.jpg'), url: '/shoptest' },
  { title: '早餐店3', img: require('../../assets/images/categories/cat-3.jpg'), url: '/shoptest' },
  { title: '早餐店4', img: require('../../assets/images/categories/cat-4.jpg'), url: '/shoptest' },
  { title: '早餐店5', img: require('../../assets/images/categories/cat-5.jpg'), url: '/shoptest' },
  { title: '早餐店6', img: require('../../assets/images/categories/cat-1.jpg'), url: '/shoptest' },
  { title: '早餐店7', img: require('../../assets/images/categories/cat-2.jpg'), url: '/shoptest' },
  { title: '早餐店8', img: require('../../assets/images/categories/cat-3.jpg'), url: '/shoptest' },
  { title: '早餐店9', img: require('../../assets/images/categories/cat-4.jpg'), url: '/shoptest' },
  { title: '早餐店10', img: require('../../assets/images/categories/cat-5.jpg'), url: '/shoptest' },  
];

// const categories1 = [
//   { title: '早餐店1', img: require('../../assets/images/categories/cat-1.jpg') },
//   { title: '早餐店2', img: require('../../assets/images/categories/cat-2.jpg') },
//   { title: '早餐店3', img: require('../../assets/images/categories/cat-3.jpg') },
//   { title: '早餐店4', img: require('../../assets/images/categories/cat-4.jpg') },
//   { title: '早餐店5', img: require('../../assets/images/categories/cat-5.jpg') },
//   { title: '早餐店6', img: require('../../assets/images/categories/cat-1.jpg') },
//   { title: '早餐店7', img: require('../../assets/images/categories/cat-2.jpg') },
//   { title: '早餐店8', img: require('../../assets/images/categories/cat-3.jpg') },
//   { title: '早餐店9', img: require('../../assets/images/categories/cat-4.jpg') },
//   { title: '早餐店10', img: require('../../assets/images/categories/cat-5.jpg') },  
// ];

const sliderSettings = {
  dots: false,
  infinite: true,
  speed: 500,
  slidesToShow: 4, // 每次顯示 4 組
  slidesToScroll: 1,
  autoplay: true,
  autoplaySpeed: 2000, // 自動播放間隔
  arrows: false, // 由 CarouselNav 控制 // 自訂箭頭不使用 slick 內建的
};

const CategoriesSection = () => {
  const sliderRef = useRef(null);

  return (
    <section className="categories">
      <div className="container">
          <CategoriesSlider categories={categories} sliderSettings={sliderSettings} />
          {/* <CategoriesSlider categories={categories1} sliderSettings={sliderSettings} /> */}
      </div>
    </section>
  );
};

export default CategoriesSection;