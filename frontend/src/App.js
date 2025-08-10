import {  Routes, Route, Navigate } from 'react-router-dom';
import AuthRoutes from './routes/AuthRoutes';
import AdminRoutes from './routes/AdminRoutes';
//import useAuth from './hooks/useAuth';

import React from 'react';

// import AppNavbar from './components/layout/Navbar';
// import MerchantHeader from './components/layout/MerchantHeader';
// import Home from './pages/Home'; 尚未製作,先註解
// import Login from './pages/Login';
import './styles/style.css';
// import ApiTest from './components/ApiTest'; //前後端專案連線測試用,可先註解
import MerchantRoutes from './routes/MerchantRoutes';

// 主路由
function App() {

  return (
      <div className="App">
        {/* 導入 AuthRoutes 模組（登入、註冊、驗證） */}
        {/* 導入 AdminRoutes 模組（後台頁面與權限驗證） */}
        {/* 暫時寫在這邊的商家與使用者首頁（之後可模組化） */}
        {/* 萬用導向 login */}
        <Routes>
          {/* 導入 AuthRoutes 模組（登入、註冊、驗證） */}
          <Route path="/auth/*" element={<AuthRoutes />} />

          {/* 導入 AdminRoutes 模組（後台頁面與權限驗證） */}
          <Route path="/admin/*" element={<AdminRoutes />} />

          {/* 商家端所有路由 */}
          <Route path="/merchant/*" element={<MerchantRoutes />} />

          {/* 暫時寫在這邊的商家與使用者首頁（之後可模組化） */}
          <Route path="/user" element={<div>👤 使用者首頁</div>} />
          <Route path="/shop" element={<div>🏪 商家首頁</div>} />

          {/* 預設路由重導向到商家登入 */}
          {/* <Route path="/" element={<Navigate to="/merchant/login" replace />} /> */}

          {/* 根路徑導向登入（保留原本萬用導向 login 的行為） */}
          <Route path="/" element={<Navigate to="/auth/login" replace />} />

          {/* 未來其他路由可以在這裡添加 */}
          {/* 例如：一般使用者路由、管理員路由等 */}

          {/* 404 處理 */}
          <Route path="*" element={<Navigate to="/auth/login" replace />} />
        </Routes>

        {/* 前後端專案連線測試用,可先註解
        <div>
          <h1>我的前端應用</h1>
          <ApiTest />
        </div>  */}
      </div>
  );
}

export default App;
