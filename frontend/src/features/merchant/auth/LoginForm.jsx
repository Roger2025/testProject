// src/features/merchant/auth/LoginForm.jsx
import { useState } from 'react';
import { useMerchantAuth } from '../../../hooks/useMerchantAuth';
import { useNavigate } from 'react-router-dom';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, loading, error } = useMerchantAuth();
  const navigate = useNavigate(); // 初始化 navigate

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('嘗試登入', email, password);
    const result = await login({ email, password });
    if (result?.success !== false) {
      navigate('/merchant/dashboard'); // 登入成功後跳轉的頁面
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>商家登入</h2>
      <input
        type="email"
        placeholder="電子郵件"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="密碼"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button type="submit" disabled={loading}>
        {loading ? '登入中...' : '登入'}
      </button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </form>
  );
};

export default LoginForm;