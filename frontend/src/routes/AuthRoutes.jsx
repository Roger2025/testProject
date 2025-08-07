// routes/AuthRoutes.jsx
import { Routes, Route } from 'react-router-dom';
import LoginPage from '../pages/admin/LoginPage';
import RegisterPage from '../pages/admin/RegisterPage';
import VerifyEmailPage from '../pages/admin/VerifyEmailPage';

// 登入註冊路由子模組
function AuthRoutes() {
  return (
    <Routes>
      <Route path="login" element={<LoginPage />} />
      <Route path="register" element={<RegisterPage />} />
      <Route path="verify" element={<VerifyEmailPage />} />
    </Routes>
  );
}

export default AuthRoutes;
