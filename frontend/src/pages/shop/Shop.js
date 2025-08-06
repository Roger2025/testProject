// ogani: shop-grid.html 
// src/pages/home/Shop.js (早餐店頁面)

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

import HeaderShop from '../../components/layout/HeaderShop';
import HeroLogin from '../../components/layout/HeroLogin';
import WallpaperShop from '../../components/shop/WallpaperShop';
import Product from '../../components/shop/Product';
import ProductList from '../../components/shop/ProductList';
import Footer from '../../components/layout/Footer';
// 已登入的店家首頁 
const Shop = () => {
  const { merchantId } = useParams(); // ✅ 取得 URL 中的 store4
  const [products, setProducts] = useState([]);
  const [shopInfo, setShopInfo] = useState(null); // 可選：店家基本資料
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // ✅ 向後端請求該店家的餐點資料
    axios.get(`http://localhost:3001/api/shop/${merchantId}`)
      .then(res => {
        setProducts(res.data.products); // 假設後端回傳格式為 { products: [...] }
        setShopInfo(res.data.shop);     // 假設也回傳店家資訊
        setLoading(false);
      })
      .catch(err => {
        console.error('取得店家資料失敗:', err);
        setLoading(false);
      });
  }, [merchantId]);

  if (loading) return <div className="text-center py-5">資料載入中...</div>;

  return (
    <>
      <HeaderShop />
      <HeroLogin />
      <WallpaperShop />
      <Product />
      <ProductList />
      <Footer />
    </>
  );
};

export default Shop;
