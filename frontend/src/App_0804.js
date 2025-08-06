// import logo from './logo.svg';
import './App.css';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.min.css';

// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Home from './pages/home/Home'; // 平台首頁
import HomePage from './pages/home/HomePage'; // 已登入的平台首頁
import Shop from './pages/home/Shop'; // 早餐店頁面
import ShopLogin from './pages/home/ShopLogin'; // 已登入的早餐店頁面
import ShopLogout from './pages/home/ShopLogout'; // 未登入的早餐店頁面
import ShopCart from './pages/home/ShopCart'; // 購物車
import OrderPage from './pages/home/OrderPage'; // 訂單表單

import Login from './pages/home/Login';
import UserRegister from './pages/home/UserRegister';

import Test from './pages/Test'; 
import LocationFetcher from './pages/LocationFetcher';

function App() {
  return (
    <div className='App'>
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
    </div>
  );
}

export default App;
