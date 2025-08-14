// src/routes/ProtectedRoute.jsx
import React, { useEffect, useRef, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { devFlags } from '../constants/devFlags';
import { setUser } from '../features/merchant/auth/merchantAuthSlice';

axios.defaults.withCredentials = true;

const normalizeRole = (r) => {
  const key = (r || '').toString().toLowerCase();
  if (['store','merchant','shop'].includes(key)) return 'shop';
  return key; // 其他像 'admin' 等維持原樣
};

const normalizeUser = (me) => {
  if (!me) return null;
  const merchantId = me.merchantId || me.merchant_id || null;
  const role = normalizeRole(me.role);
  return { ...me, merchantId: merchantId ? String(merchantId) : null, role };
};

const isValidObjectId = (v) => /^[a-f\d]{24}$/i.test(String(v || ''));

const ProtectedRoute = ({ children, role = 'shop' }) => {
  const dispatch = useDispatch();
  const location = useLocation();

  // const user = useSelector((s) => s.merchantAuth.user);
  const authSlice = useSelector(s => s.merchantAuth ?? s.auth ?? null);
  const user = authSlice?.user ?? null; 
  const [loading, setLoading] = useState(!user);
  const aliveRef = useRef(true);

  useEffect(() => {
    aliveRef.current = true;
    if (devFlags.bypassAuth || user) { setLoading(false); return; }

    (async () => {
      try {
        const res = await axios.get('http://localhost:3001/api/auth/me', {
          headers: { 'Cache-Control': 'no-cache' },
        });
        console.log('向後端發請求取得身分資料');
        let me = res?.data?.user ?? null;
        if (typeof me === 'string') { try { me = JSON.parse(me); } catch {} }
        console.log('me的內容:', me);
        const normalized = normalizeUser(me);
        if (aliveRef.current && normalized) dispatch(setUser(normalized));
      } catch {}
      finally { if (aliveRef.current) setLoading(false); }
    })();

    return () => { aliveRef.current = false; };
  }, [dispatch, user]);

  if (devFlags.bypassAuth) return children;
  if (loading) return <div style={{ padding: 24 }}>載入中…</div>;
  if (!user) return <Navigate to="/auth/login" replace state={{ from: location }} />;

  // 允許傳單一角色或角色陣列；都先正規化再比對
  const required = Array.isArray(role) ? role.map(normalizeRole) : [normalizeRole(role)];
  if (required.length && user.role && !required.includes(user.role)) {
    return <Navigate to="/auth/login" replace state={{ from: location }} />;
  }

  // 額外：若 merchantId 格式怪怪的，至少在 console 提醒（不擋頁）
  if (!isValidObjectId(user.merchantId)) {
    // eslint-disable-next-line no-console
    console.warn('[ProtectedRoute] Invalid merchantId:', user.merchantId);
  }

  return children;
};

export default ProtectedRoute;