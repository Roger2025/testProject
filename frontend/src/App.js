// import logo from './logo.svg';
import './App.css';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.min.css';

// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home'; // 引入 Home 頁面
import HomePage from './pages/HomePage'; // 引入 HomePage 頁面
import Shop from './pages/Shop'; // 引入 Shop 頁面
import ShopTest from './pages/shop/ShopTest'; // 引入 ShopTest 頁面
import Shop1 from './pages/shop/Shop1'; // 引入 Shop1 頁面
import Login from './pages/Login';
import UserRegister from './pages/UserRegister';
import Test from './pages/Test'; // 引入 Test 頁面

function App() {
  return (
    <div className='App'>
      <Routes>
        {/* 未登入 */}
        <Route path="/" element={ <Home /> } /> 
        {/* 登入後 */}
        <Route path="/homepage" element={ <HomePage /> } /> 
        <Route path="/shop" element={ <Shop /> } /> 
        <Route path="/shoptest" element={ <ShopTest /> } />
        <Route path="/shop1" element={ <Shop1 /> } />
        {/* 登入頁面 */}
        <Route path="/login" element={ <Login /> } />
        {/* 註冊頁面 */}
        <Route path="/register" element={ <UserRegister />} />
        <Route path="/test" element={ <Test /> } />
      </Routes>
    </div>
  );
}

export default App;
