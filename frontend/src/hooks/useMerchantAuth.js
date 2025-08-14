// src/hooks/useMerchantAuth.js
import { useSelector, useDispatch } from 'react-redux';
import { logout as logoutAction } from '../features/merchant/auth/merchantAuthSlice';

export const useMerchantAuth = () => {
  // 狀態形狀與 slice 對齊：user 放所有登入資訊
  const user = useSelector((s) => s.merchantAuth.user);
  const isAuthenticated = !!user;
  const loading = useSelector((s) => s.merchantAuth.loading);
  const error = useSelector((s) => s.merchantAuth.error);

  const dispatch = useDispatch();
  const logout = () => dispatch(logoutAction());

  return {
    user,                         // { merchantId, role, ... }
    merchantId: user?.merchantId ?? null,
    role: user?.role ?? null,
    isAuthenticated,
    loading,
    error,
    logout,
  };
};

// 給頁面/元件單純要 merchantId 的輕量 hook
export const useMerchantId = () =>
  useSelector((s) => s.merchantAuth.user?.merchantId ?? null);

export default useMerchantAuth;