// src/components/shop/ProductLogout.js
import React, { useRef } from 'react';
// import Slider from 'react-slick';
// import 'slick-carousel/slick/slick.css';
// import 'slick-carousel/slick/slick-theme.css';
// import CarouselNav from '../common/CarouselNav';  
import ProductLogoutSlider from './ProductLogoutSlider';

// 透過後端 Node.js /public/images/ 下載圖片
// 必須先打開 Node.js 伺服器 localhost:3001/images/merchant1
export const getImageURL = (modulePath) => {
  return `http://localhost:3001/images/merchant1/${modulePath}`;
};

const discountProducts = [
  {
    id: 1,
    category: 'burgers',
    name: '麥香雞堡',
    price: 32.0,
    oldPrice: 40.0,
    percent: '-20%',
    img: getImageURL('burgers/burgers07.jpg'),
	  url: '/burgers/',
  },
  {
    id: 2,
    category: 'toast',
    name: '麥香雞吐司',
    price: 28.0,
    oldPrice: 35.0,
    percent: '-20%',
    img: getImageURL('toast/toast06.jpg'),
	  url: '/toast/',
  },
  {
    id: 3,
    category: 'omelettes',
    name: '培根蛋餅',
    price: 44.0,
    oldPrice: 55.0,
    percent: '-20%',
    img: getImageURL('omelettes/omelettes04.jpg'),
	  url: '/omelettes/',
  },
  {
    id: 4,
    category: 'pasta',
    name: '磨菇麵',
    price: 40.0,
    oldPrice: 50.0,
    percent: '-20%',
    img: getImageURL('pasta/pasta01.jpg'),
	  url: '/pasta/',
  },
  {
    id: 5,
    category: 'single',
    name: '雞塊',
    price: 32.0,
    oldPrice: 40.0,
    percent: '-20%',
    img: getImageURL('single/single05.jpg'),
	  url: '/single/',
  },
  {
    id: 6,
    category: 'drinks',
    name: '豆漿',
    price: 16.0,
    oldPrice: 20.0,
    percent: '-20%',
    img: getImageURL('drinks/drinks04.jpg'),
	  url: '/drinks/',
  },  
  {
    id: 7,
    category: 'salad',
    name: '地瓜沙拉',
    price: 40.0,
    oldPrice: 50.0,
    percent: '-20%',
    img: getImageURL('salad/salad02.jpg'),
	  url: '/salad/',
  },
  // 更多商品...
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

const ProductLogout = () => {
  const sliderRef = useRef(null);

  return (
    <section className="categories">
      <div className="container">
          <ProductLogoutSlider Products={discountProducts} sliderSettings={sliderSettings} />
      </div>
    </section>
  );
};

export default ProductLogout;