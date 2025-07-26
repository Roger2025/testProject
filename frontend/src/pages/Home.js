// ogani：index.html 
// Home.js
// Path = pages/
import React from 'react';
// Sections
// import Preloader from '../components/Preloader';
import MobileMenu from '../components/layout/MobileMenu';
import Header from '../components/layout/Header';
import HeroSection from '../components/home/HeroSection';
import CategoriesSection from '../components/home/CategoriesSection';
import FeaturedProducts from '../components/home/FeaturedProducts';
import BannerSection from '../components/BannerSection';
import LatestProducts from '../components/home/LatestProducts';
import BlogSection from '../components/blog/BlogSection';
import Footer from '../components/layout/Footer';


const Home = () => {
  return (
    <>
      {/* <Preloader /> */}
      <MobileMenu />
      <Header />
      <HeroSection />
      <CategoriesSection />
      <FeaturedProducts />
      <BannerSection />
      <LatestProducts />
      <BlogSection />
      <Footer />
    </>
  );
};

export default Home;