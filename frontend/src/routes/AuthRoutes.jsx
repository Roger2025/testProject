// routes/AuthRoutes.jsx
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from '../pages/admin/LoginPage';
import RegisterPage from '../pages/admin/RegisterPage';
import VerifyEmailPage from '../pages/admin/VerifyEmailPage';

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
