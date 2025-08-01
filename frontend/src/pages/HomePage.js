// ogani : shop-grid.html 
// HomePage.js  // 登入後的平台首頁
// Path = pages/
// import Preloader from '../components/Preloader';
import MobileMenu from '../components/layout/MobileMenu';
import HeaderShop from '../components/layout/HeaderShop';
import HeroSectionShow from '../components/home/HeroSectionShow';
import ByteEatLogo from '../components/shop/ByteEatLogo';
import ShopSection from '../components/shop/ShopSection';
import ShopList from '../components/home/ShopList';
import Footer from '../components/layout/Footer';
import ProductPagination from '../components/shop/ProductPagination'; 
// 登入後的平台首頁 refer to Shop1.js
const HomePage = () => {
  return (
    <>
      {/* <Preloader /> */}
      <MobileMenu />
      <HeaderShop />
      <HeroSectionShow />
      <ByteEatLogo />
      <ShopSection />
      <ShopList />      
      <ProductPagination />
      <Footer />
    </>
  );
};

export default HomePage;
