// ogani：index.html 
// Home.js
// Path = pages/
import React from 'react';
// Sections
// import Preloader from '../components/Preloader';
import MobileMenu from '../../components/layout/MobileMenu';
import HeaderShop from '../../components/layout/HeaderShop';
import HeroSection from '../../components/home/HeroSection';
import CategoriesSection from '../../components/home/CategoriesSection';
import FeaturedProducts from '../../components/home/FeaturedProducts';
import BannerSection from '../../components/BannerSection';
import LatestProducts from '../../components/home/LatestProducts';
import BlogSection from '../../components/blog/BlogSection';
import Footer from '../../components/layout/Footer';
import ProductPagination from '../../components/shop/ProductPagination'; // 引入 ProductPagination

// 未登入前的店家首頁 refer to Home.js
const ShopTest = () => {
  return (
    <> <h1>Shop Test</h1>
      {/* <Preloader /> */}
      <MobileMenu />
      <HeaderShop />
      <HeroSection />
      {/* <FeaturedProducts />   */}
      <CategoriesSection />
      <FeaturedProducts />
      <ProductPagination />
      {/* <BannerSection /> */}
      {/* <LatestProducts /> */}
      {/* <BlogSection /> */}
      <Footer />
    </>
  );
};

export default ShopTest;