import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import '../../styles/admin_styles/LoginPage.css';
import { Link } from 'react-router-dom';
import axios from 'axios'; // ✅ 改用 axios 發送請求

function LoginPage() {
  const [account, setAccount] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { refetchUser } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault(); // ✅ 防止表單預設行為（整頁刷新）
    setLoading(true);
    localStorage.removeItem('adminVerified'); // ✅ 登入前清除 admin 驗證碼紀錄

    try {
      // ✅ 改用 axios 送出 POST 請求
      const res = await axios.post(
        'http://localhost:5000/api/login',
        { account, password },
        { withCredentials: true } // ✅ 攜帶 cookie 維持 session
      );

      const data = res.data;
      setLoading(false);

      if (data.status === 'success') {
        const user = data.user;

        // ✅ 顯示登入者資訊
        setMessage(`✅ 登入成功！歡迎 ${user.name}（角色：${user.role}），準備導頁中...`);
        console.log('✅ 登入成功，使用者資訊:', user);

        // ✅ 重新取得登入狀態
        await refetchUser();

        // ✅ 根據角色導頁
        setTimeout(() => {
          if (user.role === 'admin') {
            navigate('/verify', { state: { email: user.email } });
          } else if (user.role === 'shop') {
            navigate('/shop');
          } else {
            navigate('/user');
          }
        }, 2000);
      } else {
        setMessage(`❌ ${data.message || '登入失敗'}`);
      }
    } catch (error) {
      setLoading(false);
      setMessage('❌ 無法連線到伺服器，請稍後再試');
      console.error('登入錯誤:', error);
    }
  };

  return (
    <div className="login-container">
      <h2>會員登入</h2>

      <form onSubmit={handleLogin}>
        <input
          className="input-field"
          type="text"
          value={account}
          onChange={(e) => setAccount(e.target.value)}
          placeholder="帳號"
        />
        <input
          className="input-field"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="密碼"
        />
        <button
          type="submit"
          className={`login-button ${loading ? 'loading' : ''}`}
          disabled={loading}
        >
          {loading ? '登入中...' : '登入'} {/* ✅ 防止使用者狂點登入鈕 */}
        </button>
      </form>

      <p>{message}</p>

      {/* ✅ 引導去註冊頁 */}
      <p>還沒有帳號？<Link to="/register">點此註冊</Link></p>
    </div>
  );
}

export default LoginPage;
