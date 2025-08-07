import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/admin_styles/LoginPage.css';
import { Link } from 'react-router-dom';
import axios from 'axios'; 

function LoginPage() {
  const [account, setAccount] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault(); //  防止表單預設行為（整頁刷新）session被洗掉
    setLoading(true);
    setMessage('🔐 登入中，請稍候...'); // 加上登入中提示

    try {
      const res = await axios.post(
        'http://localhost:3001/api/auth/login',
        { account, password },
        { withCredentials: true } //  攜帶 cookie 維持 session
      );

      const data = res.data;

      if (data.status === 'success') {
        const user = data.user; //  後端回傳的 user 最準

        // 顯示成功訊息
        setMessage(`✅ 登入成功！歡迎 ${user.account}（角色：${user.role}），準備導頁中...`);
        console.log('登入成功，使用者資訊:', user);

        // 用回傳 user 角色導頁
        setTimeout(() => {
            setLoading(false); // ← 放在 setTimeout 裡！
            if (user.role === 'admin') {
              navigate('/verify', { state: { email: user.email } });
            } else if (user.role === 'shop') {
              navigate('/shop');
            } else {
              navigate('/user');
            }
          }, 1500);

      } else {
        setMessage(`❌ ${data.message || '登入失敗'}`);
      }
    } catch (error) {
      setLoading(false);

      if (error.response) {
        // 伺服器有回應（如 403、401 等）
        const msg = error.response.data?.message || '登入失敗';
        setMessage(`❌ ${msg}`);
      } else {
        // 完全沒收到伺服器回應（後端沒開或網路問題）
        setMessage('❌ 無法連線到伺服器，請稍後再試');
      }

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
          {loading ? '登入中...' : '登入'} {/*  防止使用者狂點登入鈕 */}
        </button>
      </form>

      <p>{message}</p>

      {/*  引導去註冊頁 */}
      <p>還沒有帳號？<Link to="/register">點此註冊</Link></p>
    </div>
  );
}

export default LoginPage;
