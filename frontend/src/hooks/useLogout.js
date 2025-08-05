import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function useLogout() {
  const navigate = useNavigate();

  return async () => {

    if (!window.confirm('你確定要登出嗎？')) return;
    
    try {
      await axios.post('http://localhost:5000/api/logout', {}, { withCredentials: true }); // 參數(url,data,config)

      alert('✅ 登出成功');
      navigate('/login');
    } catch (err) {
      alert('❌ 登出失敗');
    }
  };
}

