// ogani: index.html 
// src/pages/Home.js
import Header from '../components/layout/Header';
import Hero from '../components/layout/Hero';
import PopularShop from '../components/home/PopularShop';
import ShopList from '../components/home/ShopList';
import Footer from '../components/layout/Footer';
// 未登入的平台首頁
const Home = () => {
  return (
    <>
      <Header />
      <Hero />
      <PopularShop />
      <ShopList />
      <Footer />
    </>
  );
};

export default Home;