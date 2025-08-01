import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import useAuth from './hooks/useAuth';
import LoginPage from './pages/admin/LoginPage';
import RegisterPage from './pages/admin/RegisterPage';
import VerifyEmailPage from './pages/admin/VerifyEmailPage';
import AdminPage from './pages/admin/AdminPage';
import PendingUsersPage from './pages/admin/PendingUsersPage';
import AllUsersPage from './pages/admin/AllUsersPage';

function App() {
  const { user, authLoading } = useAuth();
  const isAdminVerified = localStorage.getItem('adminVerified') === 'true';

  if (authLoading) return <p>🔄 載入中...</p>;

  const requireAdmin = (Component) => {
    if (!user) return <Navigate to="/login" replace />;
    if (user.role !== 'admin') return <Navigate to="/login" replace />;
    if (!isAdminVerified) return <Navigate to="/verify" replace />;
    return <Component />;
  };

  return (
    <Router>
      <Routes>
        {/* 公開頁面 */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/verify" element={<VerifyEmailPage />} />

        {/* 使用者或商家首頁 */}
        <Route path="/user" element={<div>👤 使用者首頁</div>} />
        <Route path="/shop" element={<div>🏪 商家首頁</div>} />

        {/* 管理者專區，需登入 + 驗證碼 */}
        <Route path="/admin" element={requireAdmin(AdminPage)} />
        <Route path="/admin/pending-users" element={requireAdmin(PendingUsersPage)} />
        <Route path="/admin/all-users" element={requireAdmin(AllUsersPage)} />

        {/* 其他路徑導回登入 */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
