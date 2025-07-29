// ogani : shop-grid.html 
// Shop.js
// Path = pages/
import React, { useEffect, useState } from 'react';
// import Preloader from '../../components/Preloader';
import MobileMenu from '../../components/layout/MobileMenu';
import HeaderShop from '../../components/layout/HeaderShop';
import HeroSection from '../../components/home/HeroSection';
import BreadcrumbSection from '../../components/shop/BreadcrumbSection';
import FeaturedProducts from '../../components/home/FeaturedProducts';
import ProductSection from '../../components/shop/ProductSection';
import Footer from '../../components/layout/Footer';
// import product1 from '../../assets/images/product/product-8.jpg';
// import product2 from '../../assets/images/product/product-8.jpg';
import ProductPagination from '../../components/shop/ProductPagination'; // 引入 ProductPagination

// 登入後的店家首頁 
const Shop1 = () => {
  // const [products, setProducts] = useState([]);

  // useEffect(() => {
  //   // 模擬 API 呼叫
  //   setProducts([
  //     { id: 1, name: 'Apple', price: 60, img: product1 },
  //     { id: 2, name: 'Banana', price: 40, img: product2 },
  //     // 之後可串接 API 或 Redux 來源
  //   ]);
  // }, []);

  return (
    <> <h1>Shop 1</h1>
      {/* <Preloader /> */}
      <MobileMenu />
      <HeaderShop />
      <HeroSection />
      <BreadcrumbSection />
      <ProductSection />
      {/* <ProductSection products={products} /> */}
      <FeaturedProducts />
      <ProductPagination />
      <Footer />
    </>
  );
};

export default Shop1;
