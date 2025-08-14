import './App.css';
// import Login from './pages/admin/LoginPage'
import MemberCenter from "./pages/user/MemberCenter"
import MenuPage from './pages/user/MenuPage';
import OrderSummaryPage from './pages/user/OrderListPage';
import StorePage from './pages/storePage';
import {Routes, Route, Navigate} from 'react-router-dom'
import HistoryOrdersPage from './pages/user/historyOrdersPage';

// import 'bootstrap/dist/css/bootstrap.min.css';
// import 'font-awesome/css/font-awesome.min.css'; 先註解會衝突250812
// import Header from './pages/Home';
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
import HomeRoutes from './routes/HomeRoutes'; // Victor 首頁 0813
import './styles/App.css';  // Victor 首頁需要 CSS 0813
export default function App() {
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

          {/* 使用者首頁 Victor 首頁 0813 */}
          <Route path="/user/*" element={<HomeRoutes />} />
		  
          {/* 🏪 早餐店頁面 0813  */}
          <Route path="/user/shop/*" element={<MemberCenter />}>
            <Route index element={<StorePage />} />
            {/* <Route path="shop" element={<StorePage />} /> */}
            <Route path=":merchantId" element={<MenuPage />} />
            <Route path="order-list" element={<OrderSummaryPage />} />
            <Route path="history-orders" element={<HistoryOrdersPage />} />
          </Route>

          {/* 預設路由重導向到商家登入 */}
          {/* <Route path="/" element={<Navigate to="/merchant/login" replace />} /> */}

          {/* 根路徑導向登入（保留原本萬用導向 login 的行為） */}
          <Route path="/" element={<Navigate to="/auth/login" replace />} />

          {/* 未來其他路由可以在這裡添加 */}
          {/* 例如：一般使用者路由、管理員路由等 */}

          {/* 404 處理 */}
          <Route path="*" element={<Navigate to="/auth/login" replace />} />
      

        {/* 前後端專案連線測試用,可先註解
        <div>
          <h1>我的前端應用</h1>
          <ApiTest />
        </div>  */}
                      
          </Routes>
          </div>
  );
}
