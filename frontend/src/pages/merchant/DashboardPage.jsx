// src/pages/merchant/DashboardPage.jsx
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../features/merchant/auth/merchantAuthSlice';
import logo from '../../assets/ogani/img/logo.png';

const DashboardPage = () => {
  const dispatch = useDispatch();
  const user = useSelector((s) => s.merchantAuth.user);

  return (
    <div className="container mt-4">
      <h2 className="mb-3">歡迎，{user?.account || '商家'}</h2>
      <h2>現正施工中，敬請期待</h2>
      <img src={logo} alt="Ogani Logo" style={{ height: '500px' }} />
      <br></br>
      {/* <p className="text-muted">
        Merchant ID：{user?.merchantId || '(未取得)'}　／　角色：{user?.role}
      </p> */}

      <button
        className="btn btn-outline-secondary"
        onClick={() => dispatch(logout())}
      >
        登出
      </button>
    </div>
  );
};

export default DashboardPage;