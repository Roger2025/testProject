// src/routes/ProtectedRoute.jsx
import React, { useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { devFlags } from '../constants/devFlags';
import { setUser } from '../features/merchant/auth/merchantAuthSlice';

const ProtectedRoute = ({ children, fallback = '/merchant/login' }) => {
  const dispatch = useDispatch();
  const user = useSelector((s) => s.merchantAuth.user);
  const isAuthenticated = useSelector((s) => s.merchantAuth.isAuthenticated);
  const warnedRef = useRef(false);
  const injectedRef = useRef(false);

  // 開發模式：若無身分 → 注入假使用者（只做一次）
  useEffect(() => {
    if (devFlags.bypassAuth && !injectedRef.current && !user) {
      dispatch(setUser(devFlags.mockUser));
      injectedRef.current = true;
    }
  }, [dispatch, user]);

  // 只警告一次
  useEffect(() => {
    if (devFlags.bypassAuth && !warnedRef.current) {
      console.warn('[ProtectedRoute] 開發模式啟用：已繞過驗證');
      warnedRef.current = true;
    }
  }, []);

  if (devFlags.bypassAuth) return children;

  return isAuthenticated ? children : <Navigate to={fallback} replace />;
};

export default ProtectedRoute;