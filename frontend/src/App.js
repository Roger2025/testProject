// import logo from './logo.svg';
import './App.css';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.min.css';

// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home'; // 引入 Home 頁面
import Shop from './pages/Shop'; // 引入 Shop 頁面
import Login from './pages/Login';
import UserRegister from './pages/UserRegister';
import Test from './pages/Test'; // 引入 Test 頁面

function App() {
  return (
    <div className='App'>
      <Routes>
        <Route path="/" element={ <Home /> } />
        <Route path="/shop" element={ <Shop /> } />
        <Route path="/login" element={ <Login />} />
        <Route path="/register" element={ <UserRegister />} />
        <Route path="/test" element={ <Test /> } />
      </Routes>
    </div>
  );
}

export default App;
