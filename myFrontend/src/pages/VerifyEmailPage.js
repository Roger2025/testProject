import React, { useState } from 'react';
import {  useLocation } from 'react-router-dom';
import useAuth from '../hooks/useAuth'; // ✅ 引入 useAuth
import './VerifyEmailPage.css';

function VerifyEmailPage() {
  const [code, setCode] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const location = useLocation();
  const email = location.state?.email;
  const { refetchUser } = useAuth(); // ✅ 拿到重新抓 user 的方法

  const handleVerify = async () => {
    setLoading(true);
    const res = await fetch('http://localhost:5000/api/verify-email-code', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, code })
    });

    const data = await res.json();
    console.log('🔥 後端回傳資料:', data); // ← 加這行
    setLoading(false);

    if (data.status === 'success') {
      setMessage('✅ 驗證成功！轉跳後台中...');
      localStorage.setItem('adminVerified', 'true'); // ✅ 加這行！
      // ✅ 驗證成功後重新抓取登入狀態
      await refetchUser();
      console.log('✅ 準備導向 /admin'); // ← 加這行看看有沒有出現
      setTimeout(() => {
        window.location.href = '/admin';
      }, 1000);
    } else {
      setMessage('❌ 驗證失敗，請重新輸入。');
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
