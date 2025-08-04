// ogani: shop-grid.html 
// src/pages/HomePage.js 
import Header from '../components/layout/Header';
import HeroLogin from '../components/layout/HeroLogin';
import Wallpaper from '../components/home/Wallpaper';
import PopularShopLogin from '../components/home/PopularShopLogin';
import ShopList from '../components/home/ShopList';
import Footer from '../components/layout/Footer';
// 已登入的平台首頁
const HomePage = () => {
  return (
    <>
      <Header />
      <HeroLogin />
      <Wallpaper />
      <PopularShopLogin />
      <ShopList />      
      <Footer />
    </>
  );
};

export default HomePage;
