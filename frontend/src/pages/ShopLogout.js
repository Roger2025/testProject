// ogani: index.html 
// src/pages/ShopLogout.js
import HeaderShop from '../components/layout/HeaderShop';
import Hero from '../components/layout/Hero';
import ProductLogout from '../components/shop/ProductLogout';
import ProductList from '../components/shop/ProductList';
import Footer from '../components/layout/Footer';
// 未登入的店家首頁
const ShopLogout = () => {
  return (
    <> <h1>Shop Logout</h1>
      <HeaderShop />
      <Hero />
      <ProductLogout />
      <ProductList />
      <Footer />
    </>
  );
};

export default ShopLogout;