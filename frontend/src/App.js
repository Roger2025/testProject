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

  if (authLoading) return <p>🔄 載入中...</p>;

  const isAdminVerified = localStorage.getItem('adminVerified') === 'true';

  return (
    <Router>
      {/* <div style={{ padding: '10px', borderBottom: '1px solid #ccc', marginBottom: '20px' }}>
        {user ? (
          <>
            👋 歡迎回來，<strong>{user.name}</strong>（角色：{user.role}）
          </>
        ) : (
          <>未登入</>
        )}
      </div> */}

      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/verify" element={<VerifyEmailPage />} />
        <Route
          path="/admin"
          element={
            user?.role === 'admin'
              ? (isAdminVerified ? <AdminPage /> : <Navigate to="/verify" replace />)
              : <Navigate to="/login" replace />
          }
        />
        <Route path="/user" element={<div>👤 使用者首頁</div>} />
        <Route path="/shop" element={<div>🏪 商家首頁</div>} />
        <Route
          path="/admin/pending-users"
          element={
            user?.role === 'admin'
              ? <PendingUsersPage />
              : <Navigate to="/login" replace />
          }
        />
        <Route path="/admin/all-users" element={<AllUsersPage />} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
