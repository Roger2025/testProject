// pages/merchant/DashboardPage.jsx
import React from 'react';
import { useMerchantAuth } from '../../hooks/useMerchantAuth';

const DashboardPage = () => {
  const { merchant, logout } = useMerchantAuth();

  return (
    <div>
      <h2>歡迎，{merchant?.storeName}</h2>
      <button onClick={logout}>登出</button>
    </div>
  );
};

export default DashboardPage;