import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // ✅ 引入 axios
import './RegisterPage.css';

function RegisterPage() {
  const [account, setAccount] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('user');  // 預設為一般會員
  const [storeName, setStoreName] = useState(''); // ⬅️ 新增：店家名稱欄位
  const [storeAddress, setStoreAddress] = useState(''); // ⬅️ 新增：店家地址欄位
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleRegister = async () => {
    // ✅ 新增：逐一檢查欄位是否填寫
    if (!account) {
      setMessage('❌ 請填寫帳號');
      return;
    }

    if (!password) {
      setMessage('❌ 請填寫密碼');
      return;
    }

    if (!email) {
      setMessage('❌ 請填寫 Email');
      return;
    }

    if (role === 'shop') {
      if (!storeName) {
        setMessage('❌ 請填寫店家名稱');
        return;
      }
      if (!storeAddress) {
        setMessage('❌ 請填寫店家地址');
        return;
      }
    }

    const isValidPassword = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{6,20}$/;
    // 至少一個字母、一個數字，長度 6～20

    if (!isValidPassword.test(password)) {
      setMessage('❌ 密碼需含英文與數字，長度 6～20 字元');
      return;
    }

    try {
      const res = await axios.post('http://localhost:5000/api/register', {
        account,
        password,
        email,
        role,
        storeName: role === 'shop' ? storeName : '', // ⬅️ 新增欄位傳送
        storeAddress: role === 'shop' ? storeAddress : '' // ⬅️ 新增欄位傳送
      });

      setMessage(res.data.message);

      if (res.data.status === 'success') {
        setTimeout(() => {
          navigate('/login');
        }, 1500);
      }
    } catch (err) {
      console.error('❌ 註冊失敗:', err);
      setMessage('❌ 發生錯誤，請稍後再試');
    }
  };

  return (
    <div className="register-container">
      <h2>註冊新帳號</h2>

      <input
        type="text"
        placeholder="帳號"
        value={account}
        onChange={(e) => setAccount(e.target.value)}
        className="register-input"
      />

      <input
        type="password"
        placeholder="密碼"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="register-input"
      />

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="register-input"
      />

      <select
        value={role}
        onChange={(e) => setRole(e.target.value)}
        className="register-select"
      >
        <option value="user">一般會員</option>
        <option value="shop">商家</option>
      </select>

      {/* ⬅️ 根據角色是商家時，顯示額外欄位 */}
      {role === 'shop' && (
        <>
          <input
            type="text"
            placeholder="店家名稱"
            value={storeName}
            onChange={(e) => setStoreName(e.target.value)}
            className="register-input"
          />
          <input
            type="text"
            placeholder="店家地址"
            value={storeAddress}
            onChange={(e) => setStoreAddress(e.target.value)}
            className="register-input"
          />
        </>
      )}

      <button className="register-button" onClick={handleRegister}>
        註冊
      </button>

      <p>{message}</p>
    </div>
  );
}

export default RegisterPage;
