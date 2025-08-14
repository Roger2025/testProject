//src/pages/admin/LoginPage.jsx
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../../styles/admin_styles/LoginPage.css';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { setUser } from '../../features/merchant/auth/merchantAuthSlice';

// 登入頁面
function LoginPage() {
  const [account, setAccount] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState(''); // // 提示訊息
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const normalizeRole = (r) => {
    const key = String(r || '').toLowerCase();
    return ['shop','store','merchant'].includes(key) ? 'shop' : key;
  };
  const normalizeUser = (u) => {
    if (!u) return null;
    const raw = typeof u === 'string' ? (()=>{ try { return JSON.parse(u); } catch { return null; } })() : u;
    if (!raw) return null;
    const mid = raw.merchantId ?? raw.merchant_id ?? null;
    return { ...raw, role: normalizeRole(raw.role), merchantId: mid ? String(mid) : null };
  };

  const handleLogin = async (e) => {
    e.preventDefault(); //  防止表單預設行為（整頁刷新）
    setLoading(true);
    setMessage('🔐 登入中，請稍候.'); // 加上登入中提示

    try {
      const res = await axios.post(
        'http://localhost:3001/api/auth/login',
        { account, password },

        { withCredentials: true } //  攜帶 cookie 維持 session
      );

                          const data = res.data; // { status, user? }
      if (data.status === 'success') {
        // 立刻以 session 再取一次 /me，拿到完整 user（含 merchantId）
        const meRes = await axios.get('http://localhost:3001/api/auth/me', {
          withCredentials: true,
          headers: { 'Cache-Control': 'no-cache' }
        });
        const fullUser = normalizeUser(meRes?.data?.user);
        if (!fullUser?.merchantId && normalizeRole(fullUser?.role) === 'shop') {
          throw new Error('登入成功但未取得商家身分（merchantId）。');
        }

        // 寫進 Redux，讓 /merchant/* 的 ProtectedRoute/API 能取到 merchantId
        if (fullUser) dispatch(setUser(fullUser));

        setMessage(`✅ 登入成功！歡迎 ${fullUser?.account ?? ''}（角色：${fullUser?.role ?? ''}）`);
        setLoading(false);

        // 有 from 就回原頁，否則進商家儀表板
        const from = location.state?.from?.pathname;
        if (fullUser?.role === 'admin') {
          navigate('/auth/verify', { replace: true, state: { email: fullUser.email } });
        } else if (fullUser?.role === 'shop') {
          navigate(from && from.startsWith('/merchant/') ? from : '/merchant/dashboard', { replace: true });
        } else {
          navigate('/user', { replace: true });
        }
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
      <p>還沒有帳號？<Link to="/auth/register">點此註冊</Link></p>
    </div>
  );
}

export default LoginPage;