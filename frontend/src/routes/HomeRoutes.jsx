// src/routes/HomeRoutes.js
import React from 'react';
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Routes, Route, Navigate } from 'react-router-dom';

import Home from '../pages/Home'; // 平台首頁
import HomePage from '../pages/HomePage'; // 已登入的平台首頁

import Shop from '../pages/Shop'; // 早餐店頁面
import ShopLogin from '../pages/ShopLogin'; // 已登入的早餐店頁面
import ShopLogout from '../pages/ShopLogout'; // 未登入的早餐店頁面

import ShopCart from '../pages/ShopCart'; // 購物車
import OrderPage from '../pages/OrderPage'; // 訂單表單

import Login from '../pages/Login';
import UserRegister from '../pages/UserRegister';

import Test from '../pages/Test'; 
import LocationFetcher from '../pages/LocationFetcher';

function HomeRoutes() {
  return (
    <Routes>
      <Route 
        path="/*" 
        element={ 
            <Routes>
            {/* 未登入 */}
            <Route path="/" element={ <Home /> } /> 
            {/* 已登入 */}
            <Route path="/homepage" element={ <HomePage /> } /> 
            <Route path="/shop" element={ <Shop /> } /> 
            <Route path="/shoplogin" element={ <ShopLogin /> } />
            <Route path="/shoplogout" element={ <ShopLogout /> } />
            {/* 登入 */}
            <Route path="/login" element={ <Login /> } />
            {/* 註冊 */}
            <Route path="/register" element={ <UserRegister />} />
            {/* 購物車 */}
            <Route path="/shopcart" element={ <ShopCart /> } />
            {/* 訂單表單 */}
            <Route path="/orderpage" element={ <OrderPage /> } />         
            <Route path="/test" element={ <Test /> } />
            <Route path="/location" element={ <LocationFetcher /> } />
            </Routes>
        }
      /> 
    </Routes>
  );
}

export default HomeRoutes;