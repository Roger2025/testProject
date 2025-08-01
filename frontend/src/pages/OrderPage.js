// ogani：shoping-cart.html 
// OrderPage.js
// Path = pages/
import React from 'react';
// Sections
// import Preloader from '../components/Preloader';
import MobileMenu from '../components/layout/MobileMenu';
import Header from '../components/layout/Header';
import HeroSection from '../components/home/HeroSection';
import BreadcrumbSection from '../components/shop/BreadcrumbSection';
import OrderTable from '../components/cart/OrderTable'; // 假設有一個訂單表格組件
import Footer from '../components/layout/Footer';
// 訂單表格
const OrderPage = () => {
  return (
    <>
      {/* <Preloader /> */}
      <MobileMenu />
      <Header />
      <HeroSection />
      <BreadcrumbSection />
      {/* 這裡可以加入訂單表單的內容 */}  
      <OrderTable />
      <Footer />
    </>
  );
};

export default OrderPage;