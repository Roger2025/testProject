import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AuthRoutes from './routes/AuthRoutes';
import AdminRoutes from './routes/AdminRoutes';
//import useAuth from './hooks/useAuth';

// 主路由
function App() {

  return (
    <BrowserRouter>
      <Routes>
        {/* 導入 AuthRoutes 模組（登入、註冊、驗證） */}
        <Route path="/auth/*" element={<AuthRoutes />} />

        {/* 導入 AdminRoutes 模組（後台頁面與權限驗證） */}
        <Route path="/admin/*" element={<AdminRoutes />} />

        {/* 暫時寫在這邊的商家與使用者首頁（之後可模組化） */}
        <Route path="/user" element={<div>👤 使用者首頁</div>} />
        <Route path="/shop" element={<div>🏪 商家首頁</div>} />

        {/* 萬用導向 login */}
        <Route path="*" element={<Navigate to="/auth/login" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
