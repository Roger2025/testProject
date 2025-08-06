// ogani: shoping-cart.html 
// src/pages/home/ShopCart.js (購物車)
import HeaderShop from '../../components/layout/HeaderShop';
import Hero from '../../components/layout/Hero';
import WallpaperShop from '../../components/shop/WallpaperShop';
import ShoppingCart from '../../components/cart/ShoppingCart';
import Footer from '../../components/layout/Footer';
// 購物車
const ShopCart = () => {
  return (
    <>
      <HeaderShop />
      <Hero />
      <WallpaperShop />
      <ShoppingCart />
      <Footer />
    </>
  );
};

export default ShopCart;