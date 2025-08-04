// ogani: shoping-cart.html 
// src/pages/OrderPage.js
import HeaderShop from '../components/layout/HeaderShop';
import Hero from '../components/layout/Hero';
import WallpaperShop from '../components/shop/WallpaperShop';
import OrderTable from '../components/cart/OrderTable'; 
import Footer from '../components/layout/Footer';
// 訂單表格
const OrderPage = () => {
  return (
    <>
      <HeaderShop />
      <Hero />
      <WallpaperShop />
      <OrderTable />
      <Footer />
    </>
  );
};

export default OrderPage;