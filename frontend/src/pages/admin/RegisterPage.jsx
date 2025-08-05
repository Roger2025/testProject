import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../../styles/admin_styles/RegisterPage.css';
import validator from 'validator';

function RegisterPage() {

  // 狀態管理
  const [account, setAccount] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [nickName, setNickName] = useState('');
  const [role, setRole] = useState('user');
  const [storeName, setStoreName] = useState('');
  const [storeAddress, setStoreAddress] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // 輸入錯誤顯示區塊
  const validate = () => {
    if (!account) return '❌ 請填寫帳號';
    if (!password) return '❌ 請填寫密碼';
    if (!email) return '❌ 請填寫 Email';
    if (!phone) return '❌ 請填寫電話';
    if (!validator.isMobilePhone(phone, 'zh-TW')) return '❌ 請輸入正確的手機號碼'; 
    if (!validator.isEmail(email)) return '❌ Email 格式錯誤'; 
    if (!nickName) return '❌ 請填寫暱稱';
    if (role === 'shop') {
      if (!storeName) return '❌ 請填寫店家名稱';
      if (!storeAddress) return '❌ 請填寫店家地址';
    }

    // 正則表達式規範
    const isValidPassword = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{6,20}$/;
    if (!isValidPassword.test(password)) {
      return '❌ 密碼需含英文與數字，長度 6～20 字元';
    }
    return '';
  };

  // 註冊處理
  const handleRegister = async (e) => {
    e.preventDefault(); // 防止預設跳轉
    const errorMsg = validate();
    if (errorMsg) return setMessage(errorMsg);

    setLoading(true); // 按下送出鎖住按鈕
    setMessage('📝 註冊中，請稍候...');

    try {
      const res = await axios.post('http://localhost:5000/api/register', {
        account,
        password,
        email,
        phone,
        nickName,
        role,
        storeName: role === 'shop' ? storeName : '',
        storeAddress: role === 'shop' ? storeAddress : ''
      });

      setMessage(res.data.message); // 判斷完回傳結果
      setLoading(false); // 按鈕打開

      // 成功後1.5秒跳轉 等一下增加使用者體驗
      if (res.data.status === 'success') {
        setTimeout(() => {
          navigate('/login');
        }, 1500);
      }
    } catch (err) {
      setLoading(false);
      console.error('❌ 註冊失敗:', err);
      setMessage('❌ 發生錯誤，請稍後再試');
    }
  };

  return (
    <div className="register-container">
      <h2>註冊新帳號</h2>
       <form className="register-form" onSubmit={handleRegister} noValidate>  { /*取消預設表單驗證*/ }
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

        <input
          type="tel"
          placeholder="電話（例如 0912345678）"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="register-input"
        />

        <input
          type="text"
          placeholder="匿名暱稱"
          value={nickName}
          onChange={(e) => setNickName(e.target.value)}
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

        <button
          type="submit"
          className="register-button"
          disabled={loading} // 防止使用者狂點按鈕
        >
          {loading ? '註冊中...' : '註冊'}
        </button>
      </form>

      <p>{message}</p>
    </div>
  );
}

export default RegisterPage;
