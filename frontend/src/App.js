// src/App.js
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
// import AppNavbar from './components/layout/Navbar';
// import MerchantHeader from './components/layout/MerchantHeader';
// import Home from './pages/Home'; 尚未製作,先註解
// import Login from './pages/Login';
import './styles/style.css';
// import ApiTest from './components/ApiTest'; //前後端專案連線測試用,可先註解
import MerchantRoutes from './routes/MerchantRoutes';
// import logo from './logo.svg';
import './App.css';

// import 'bootstrap/dist/css/bootstrap.min.css';
// import 'font-awesome/css/font-awesome.min.css';

// src/App.js
import React from 'react';
// import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Routes, Route, Navigate } from 'react-router-dom';

import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import HomeRoutes from './routes/HomeRoutes';
// import StorePage from './pages/StorePage'; // 測試 merchantId 回傳到後端 Node.js

function App() {
  const navigate = useNavigate();
  const isLoggedIn = Boolean(localStorage.getItem('token')); // 或從 context 判斷

  useEffect(() => {
    if (isLoggedIn) {
      navigate('/homepage');
    } else {
      navigate('/');
    }
  }, [isLoggedIn]);

  return (
    <div className="App">
      {/* <h1>測試畫面是否有 render</h1> */}
      <Routes>
        {/* 商家端所有路由 */}
        <Route path="/merchant/*" element={<MerchantRoutes />} />
        
        {/* 預設路由重導向到商家登入 */}
        {/* <Route path="/" element={<Navigate to="/merchant/login" replace />} /> */}
        
        {/* 未來其他路由可以在這裡添加 */}
        {/* 例如：一般使用者路由、管理員路由等 */}
        
        {/* 404 處理 */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      {/* 前後端專案連線測試用,可先註解
      <div>
        <h1>我的前端應用</h1>
        <ApiTest />
      </div>  */}
    <div className='App'>

        <Routes>
          {/* 其他頁面由 HomeRoutes 處理 */}
          <Route path="/*" element={<HomeRoutes />} />

          {/* 最後兜底：未知路徑導回首頁 */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>

    </div>
  );
}

export default App;
