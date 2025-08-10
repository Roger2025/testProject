//src/pages/Login.jsx
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { login } from '../store/slices/authSlice';
import 'bootstrap/dist/css/bootstrap.min.css'; // Bootstrap 標準樣式
import '../assets/ogani/css/style.css';          // Ogani 自定義樣式主檔
import '../assets/ogani/css/font-awesome.min.css'; // 如需圖示支援


const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(login({ email, password }))
      .unwrap()
      .then(() => navigate('/dashboard'))
      .catch(err => alert(err.message));
  };

  return (
    <div className="container mt-5">
      <h2>商家登入</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Email</label>
          <input type="email" className="form-control" value={email} onChange={e => setEmail(e.target.value)} />
        </div>
        <div className="mb-3">
          <label className="form-label">密碼</label>
          <input type="password" className="form-control" value={password} onChange={e => setPassword(e.target.value)} />
        </div>
        <button type="submit" className="btn btn-primary">登入</button>
      </form>
    </div>
  );
};

export default Login;