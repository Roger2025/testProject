import { useEffect, useState } from 'react';  
import axios from 'axios';

axios.defaults.withCredentials = true; // 所有 axios 請求都自動帶上 cookie

export default function useAuth() {
  const [user, setUser] = useState(null);  
  const [checking, setChecking] = useState(true);

  const fetchUser = () => {
    setChecking(true);

    axios.get('http://localhost:3001/api/auth/me')
      .then(res => {
        setUser(res.data.user);
        console.log(' 取得 user:', res.data.user);
        return res.data.user; // 確保驗證後拿到true
      })
      .catch(() => {
        setUser(null);
      })
      .finally(() => {
        setChecking(false);
      });
  };

  useEffect(() => {
    fetchUser();
  }, []);  

  return {
    user,
    authLoading: checking,
    refetchUser: fetchUser,
  };
}
