import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import '../../styles/admin_styles/VerifyEmailPage.css';

function VerifyEmailPage() {
  const [code, setCode] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const location = useLocation();
  const email = location.state?.email;
  const { refetchUser } = useAuth();
  const navigate = useNavigate();

  const handleVerify = async () => {
    setLoading(true);
    setMessage('🔐 驗證中，請稍候...'); // ✅ 顯示驗證中提示

    try {
      const res = await fetch('http://localhost:5000/api/verify-email-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code })
      });

      const data = await res.json();
      console.log('🔥 後端回傳資料:', data);
      setLoading(false);

      if (data.status === 'success') {
        setMessage('✅ 驗證成功！轉跳後台中...');
        localStorage.setItem('adminVerified', 'true');

        // ✅ refetchUser 加 timeout 防卡住
        const timeout = new Promise((resolve) => setTimeout(resolve, 3000));
        await Promise.race([refetchUser(), timeout]);

        console.log('✅ 準備導向 /admin');
        setTimeout(() => {
          navigate('/admin'); // ✅ 保留 React Router 狀態
        }, 800); // ✅ 縮短等待時間
      } else {
        setMessage(data.message || '❌ 驗證失敗，請重新輸入。'); // ✅ 顯示後端錯誤訊息
      }
    } catch (err) {
      console.error('❌ 發送驗證請求失敗:', err);
      setMessage('❌ 發送驗證請求失敗，請稍後再試');
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
        disabled={loading}
      >
        {loading ? '驗證中...' : '驗證'}
      </button>
      <p>{message}</p>
    </div>
  );
}

export default VerifyEmailPage;
