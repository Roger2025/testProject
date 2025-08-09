// src/routes/HomeRoutes.jsx (平台首頁 by 許昌源)
import React from 'react';
import { Routes, Route } from 'react-router-dom';

// import 'bootstrap/dist/css/bootstrap.min.css'; // Bootstrap 4 核心樣式

import Home from '../pages/home/Home'; // 平台首頁
import HomePage from '../pages/home/HomePage'; // 已登入的平台首頁

import Login from '../pages/home/Login';
import UserRegister from '../pages/home/UserRegister';

import Shop from '../pages/shop/Shop'; // 早餐店頁面
// import ShopLogin from '../pages/shop/ShopLogin'; // 已登入的早餐店頁面
import ShopLogout from '../pages/shop/ShopLogout'; // 未登入的早餐店頁面

import ShopCart from '../pages/home/ShopCart'; // 購物車
import OrderPage from '../pages/home/OrderPage'; // 訂單表單
import OrderPageId from '../pages/home/OrderPageId'; // 訂單表單

import Test from '../pages/Test'; // Test 
import LocationFetcher from '../pages/LocationFetcher'; // 抓取目前定位的經緯度

function HomeRoutes() {
  return (
    <Routes>
      <Route 
        path="/*" 
        element={ 
            <Routes>
              {/* 平台首頁 */}
              <Route path="/" element={<Home />} />
              <Route path="/homepage" element={<HomePage />} /> 

              {/* 登入 / 註冊 */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<UserRegister />} />

              {/* 早餐店頁面 */}
              <Route path="/shop/:merchantId" element={ <Shop /> } /> 
              {/* <Route path="/shop/:merchantId" element={ <ShopLogin /> } /> */}
              <Route path="/shoplogout" element={ <ShopLogout /> } />

              {/* 購物車 / 訂單 */}
              <Route path="/shopcart" element={<ShopCart />} />
              <Route path="/order" element={<OrderPage />} />
              <Route path="/order/:order_id" element={<OrderPageId />} />

              {/* 工具 / 測試 */}
              <Route path="/test" element={<Test />} />
              <Route path="/location" element={<LocationFetcher />} />
            </Routes>
        }
      /> 
    </Routes>
  );
}

export default HomeRoutes;