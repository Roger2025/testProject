import React, { useRef } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import CarouselNav from './CarouselNav.js'; 
import CategoriesSlider from './CategoriesSlider';

// 透過後端 Node.js /public/images/ 下載圖片
// 必須先打開 Node.js 伺服器 localhost:3001/images/merchant1
export const getImageURL = (modulePath) => {
  return `http://localhost:3001/images/${modulePath}`;
};

// 類別資料清單，可從 API 或 props 傳入
const categories = [
  // 現在想要放在 node.js 設定的 backend/public/images/
  { title: '早餐店1', img: getImageURL('merchant01.jpg'), url: '/shop1' },
  { title: '早餐店2', img: getImageURL('merchant02.jpg'), url: '/shoptest' },
  { title: '早餐店3', img: getImageURL('merchant03.jpg'), url: '/shoptest' },
  { title: '早餐店4', img: getImageURL('merchant04.jpg'), url: '/shoptest' },
  { title: '早餐店5', img: getImageURL('merchant05.jpg'), url: '/shoptest' },
  { title: '早餐店6', img: getImageURL('merchant06.jpg'), url: '/shoptest' },
  { title: '早餐店7', img: getImageURL('merchant07.jpg'), url: '/shoptest' },
  { title: '早餐店8', img: getImageURL('merchant08.jpg'), url: '/shoptest' },
  { title: '早餐店9', img: getImageURL('merchant09.jpg'), url: '/shoptest' },
  { title: '早餐店10', img: getImageURL('merchant10.jpg'), url: '/shoptest' },  

// 原本圖片放在 react 設定的 frontend/src/assets/images/
  // { title: '早餐店1', img: require('../../assets/images/merchant01.jpg'), url: '/shop1' },
  // { title: '早餐店2', img: require('../../assets/images/merchant02.jpg'), url: '/shoptest' },
  // { title: '早餐店3', img: require('../../assets/images/merchant03.jpg'), url: '/shoptest' },
  // { title: '早餐店4', img: require('../../assets/images/merchant04.jpg'), url: '/shoptest' },
  // { title: '早餐店5', img: require('../../assets/images/merchant05.jpg'), url: '/shoptest' },
  // { title: '早餐店6', img: require('../../assets/images/merchant06.jpg'), url: '/shoptest' },
  // { title: '早餐店7', img: require('../../assets/images/merchant07.jpg'), url: '/shoptest' },
  // { title: '早餐店8', img: require('../../assets/images/merchant08.jpg'), url: '/shoptest' },
  // { title: '早餐店9', img: require('../../assets/images/merchant09.jpg'), url: '/shoptest' },
  // { title: '早餐店10', img: require('../../assets/images/merchant10.jpg'), url: '/shoptest' },  

];

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
      </div>
    </section>
  );
};

export default CategoriesSection;