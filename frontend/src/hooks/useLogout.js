// src/hooks/useLogout.js
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function useLogout() {
  const navigate = useNavigate();

  return async () => {

    if (!window.confirm('你確定要登出嗎？')) return;
    
    try {
      await axios.post('http://localhost:5000/api/logout', {}, { withCredentials: true });
      localStorage.removeItem('adminVerified'); // ✅ 登出時清除 admin 驗證狀態
      alert('✅ 登出成功');
      navigate('/login');
    } catch (err) {
      alert('❌ 登出失敗');
    }
  };
}

