// src/pages/merchant/OrdersPage.jsx
import React from 'react';
import OrderList from '../../features/merchant/orders/OrderList';

// const FEATURE_ENABLE_SET_MENU = false; // 開發期間關閉，正式時設 true

const OrdersPage = () => {
  return (
    <div className="container mt-4">
      <h2 className="mb-4">訂單管理頁</h2>

      <section className="mb-5">
        {/* <h4>訂單</h4> */}
        <OrderList />
      </section>

    </div>
  );
};

export default OrdersPage;
