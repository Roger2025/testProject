// src/hooks/useInitMerchantSession.js
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { setUser, setError, setLoading } from '../features/merchantAuth/merchantAuthSlice';

axios.defaults.withCredentials = true; // 自動帶 cookie

export default function useInitMerchantSession() {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchSessionUser = async () => {
      dispatch(setLoading(true));
      try {
        const res = await axios.get('http://localhost:3001/api/auth/me'); // 取當前登入者資訊
        if (res.data?.user) {
          dispatch(setUser(res.data.user)); // 把 user 塞進 Redux
          console.log('Session user 初始化完成:', res.data.user);
        } else {
          dispatch(setUser(null)); // 沒登入 → 清空
        }
      } catch (err) {
        console.error('無法取得 session user', err);
        dispatch(setError('未登入或驗證失敗'));
        dispatch(setUser(null));
      }
    };

    fetchSessionUser();
  }, [dispatch]);
}