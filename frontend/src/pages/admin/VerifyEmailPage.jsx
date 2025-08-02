import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import '../../styles/admin_styles/VerifyEmailPage.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


function VerifyEmailPage() {
  const [code, setCode] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const location = useLocation(); // 使用 useLocation 取得路由狀態 (讀取導頁前email)
  const email = location.state?.email;
  const { refetchUser } = useAuth();
  const navigate = useNavigate();
  const handleVerify = async () => {
    setLoading(true);
    setMessage('🔐 驗證中，請稍候...');

    try {
      // ✅ 驗證碼驗證
      const res = await axios.post(
        'http://localhost:5000/api/verify-email-code',
        { email, code },
        { withCredentials: true }
      );

      const data = res.data;
      setLoading(false);

      if (data.status === 'success') {
        setMessage('✅ 驗證成功，重新取得登入狀態...');

        //  更新 user 狀態（會讓 App.jsx 自動判斷是否跳轉）
        const user = await refetchUser();

        console.log('✅ 最新使用者資訊:', user);

        // 強制導頁，不讓 App.jsx 的判斷卡住
        // window.location.href = '/admin';

        // setTimeout(() => {
        //   navigate('/admin');
        // }, 500); // 給 useAuth 更新 React state 的時間

        setTimeout(() => {
          window.location.href = '/admin';
        }, 500); // 刷新整個頁面

  
      } else {
        setMessage(data.message || '❌ 驗證失敗，請重新輸入。');
      }
    } catch (err) {
      console.error('❌ 驗證失敗:', err);
      setMessage('❌ 發送失敗，請稍後再試');
      setLoading(false);
    }
  };

  return (
    <div className="verify-container">
      <h2>請輸入 Email 驗證碼</h2>
      <input
        className="input-field"
        type="text"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder="驗證碼"
      />
      <button
        className={`login-button ${loading ? 'loading' : ''}`}
        onClick={handleVerify}
        disabled={loading} // 控制按鈕點擊
      >
        {loading ? '驗證中...' : '驗證'}
      </button>
      <p>{message}</p>
    </div>
  );
}

export default VerifyEmailPage;
