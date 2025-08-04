// ogani: shop-grid.html 
// src/pages/ShopLogin.js
import HeaderShop from '../components/layout/HeaderShop';
import HeroLogin from '../components/layout/HeroLogin';
import WallpaperShop from '../components/shop/WallpaperShop';
import Product from '../components/shop/Product';
import ProductList from '../components/shop/ProductList';
import Footer from '../components/layout/Footer';
// 已登入的店家首頁 
const ShopLogin = () => {
  return (
    <> <h1>Shop Login</h1>
      <HeaderShop />
      <HeroLogin />
      <WallpaperShop />
      <Product />
      <ProductList />
      <Footer />
    </>
  );
};

export default ShopLogin;
