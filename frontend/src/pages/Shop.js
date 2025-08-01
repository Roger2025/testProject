// ogani : shop-grid.html 
// Shop.js  // 登入後的店家首頁 
// Path = pages/
// import Preloader from '../components/Preloader';
import MobileMenu from '../components/layout/MobileMenu';
import HeaderShop from '../components/layout/HeaderShop';
import HeroSection from '../components/home/HeroSection';
import BreadcrumbSection from '../components/shop/BreadcrumbSection';
import ProductSection from '../components/shop/ProductSection';
import FeaturedProducts from '../components/home/FeaturedProducts';
import ProductPagination from '../components/shop/ProductPagination'; 
import Footer from '../components/layout/Footer';
// 登入後的店家首頁 
const Shop = () => {
  return (
    <>
      {/* <Preloader /> */}
      <MobileMenu />
      <HeaderShop />
      <HeroSection />
      <BreadcrumbSection />
      <ProductSection />
      <FeaturedProducts />
      <ProductPagination />
      <Footer />
    </>
  );
};

export default Shop;
