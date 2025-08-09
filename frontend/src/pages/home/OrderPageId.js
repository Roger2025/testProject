// ogani: shoping-cart.html 
// src/pages/home/OrderPageId.js (訂單表格)
import HeaderShop from '../../components/layout/HeaderShop';
import Hero from '../../components/layout/Hero';
import WallpaperShop from '../../components/shop/WallpaperShop';
import OrderTable from '../../components/cart/OrderTable'; 
import Footer from '../../components/layout/Footer';
// 訂單表格
const OrderPageId = () => {
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

export default OrderPageId;