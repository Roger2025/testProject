// ogani: index.html 
// src/pages/home/Home.js (平台首頁)
// import React, { useState } from 'react';
import Header from '../../components/layout/Header';
import Hero from '../../components/layout/Hero';
import PopularShop from '../../components/home/PopularShop';
import ShopList from '../../components/home/ShopList';
import Footer from '../../components/layout/Footer';
// import { products } from '../../data/products'; // 假設有這個資料
import { useShopData } from '../../hooks/useShopData';

// 未登入的平台首頁
const Home = () => {
  // const [filteredProducts, setFilteredProducts] = useState(products);

  // const handleSearch = (keyword) => {
  //   const result = products.filter(p =>
  //     [p.name, p.description, p.storeName].some(field =>
  //       field?.toLowerCase().includes(keyword)
  //     )
  //   );
  //   setFilteredProducts(result);
  // };

  const {
    shops,
    loading,
    error,
    empty,
    // filters,
    setFilters,
    // refetch,
  } = useShopData();

  const handleSearch = (keyword) => {
    setFilters((prev) => ({
      ...prev,
      search: keyword,
      page: 1, // 搜尋時重設分頁
    }));
  };

  if (loading) return <div>載入中...</div>;
  if (error) return <div>錯誤：{error.message}</div>;
  if (empty) return <div>目前沒有店家</div>;

  return (
    <>
      <Header />
      <Hero onSearch={handleSearch} />
      <PopularShop />
      {/* <ShopList products={filteredProducts} /> */}
      <ShopList products={shops} />
      <Footer />
    </>
  );
};

export default Home;