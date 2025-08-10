import { useEffect, useState } from 'react';  
import axios from 'axios';

axios.defaults.withCredentials = true; // 所有 axios 請求都自動帶上 cookie

export default function useAuth() {
  const [user, setUser] = useState(null);  

  const [checking, setChecking] = useState(true); // 檢查登入狀態時顯示 loading（避免畫面閃爍）

  // 發送 API 請求：取得目前登入者資訊
  const fetchUser = () => {
    setChecking(true); 

    axios.get('http://localhost:5000/api/me')  // 這支 API 是後端的「檢查登入狀態」
      .then(res => {
        setUser(res.data.user);  
        console.log('✅ 取得 user:', res.data.user);
      })
      .catch(() => {
        setUser(null);  // 沒登入或驗證失敗 → user 設為 null
      })
      .finally(() => {
        setChecking(false);  // 不管成功失敗，檢查完成 → 關閉載入狀態
      });
  };

  // Component 第一次載入時自動觸發 fetchUser
  useEffect(() => {
    fetchUser();
  }, []);  

  // user 資料、是否還在 loading、重新檢查的方法
  return {
    user,                    //  當前使用者（未登入會是 null）
    authLoading: checking,   //  是否正在檢查中
    refetchUser: fetchUser   //  外部也可以手動重新取得登入資訊
  };
}
