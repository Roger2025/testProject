// src/App.js
import React from 'react';
// import { Routes, Route } from 'react-router-dom';
// import AppNavbar from './components/layout/Navbar';
import MerchantHeader from './components/layout/MerchantHeader';
// import Home from './pages/Home'; 尚未製作,先註解
// import Login from './pages/Login';
import './styles/style.css';
// import ApiTest from './components/ApiTest'; //前後端專案連線測試用,可先註解
import MerchantRoutes from './routes/MerchantRoutes';

function App() {
  return (
    <div className="App">
      {/* <h1>測試畫面是否有 render</h1> */}
      <MerchantHeader/>
      {/* <Routes> */}
        {/* <Route path="/" element={<Home />} /> */}
        {/* <Route path="/login" element={<Login />} /> */}
        {/* 未來可加入 ProtectedRoute 包裝 /dashboard 等 */}
      {/* </Routes> */}
      <MerchantRoutes />
      {/* 前後端專案連線測試用,可先註解
      <div>
        <h1>我的前端應用</h1>
        <ApiTest />
      </div>  */}
    </div>
  );
}

export default App;
