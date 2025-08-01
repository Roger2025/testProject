// ogani：shoping-cart.html 
// ShopCart.js  
// Path = pages/
import React from 'react';
// Sections
// import Preloader from '../components/Preloader';
import MobileMenu from '../components/layout/MobileMenu';
import Header from '../components/layout/Header';
import HeroSection from '../components/home/HeroSection';
import BreadcrumbSection from '../components/shop/BreadcrumbSection';
import ShoppingCart from '../components/cart/ShoppingCart';
import Footer from '../components/layout/Footer';
// 購物車
const ShopCart = () => {
  return (
    <>
      {/* <Preloader /> */}
      <MobileMenu />
      <Header />
      <HeroSection />
      <BreadcrumbSection />
      {/* 這裡可以加入訂單表單的內容 */}  
      <ShoppingCart />
      <Footer />
    </>
  );
};

export default ShopCart;