// src/routes/ProtectedRoute.jsx
import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { devFlags } from '../constants/devFlags';

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  // 若開啟 devFlags.bypassAuth，強制允許通過
  if (devFlags.bypassAuth) {
    console.warn('[ProtectedRoute] 開發模式啟用：已繞過驗證');
    return children;
  }

  // 否則根據驗證狀態決定導向
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;