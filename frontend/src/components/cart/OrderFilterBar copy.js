// src/components/cart/OrderFilterBar.js (篩選訂單)

import React from 'react';

const OrderFilterBar = ({
  orders = [],
  filteredOrders = [],
  selectedOrder,
  setSelectedOrder,
  filterDate,
  setFilterDate,
  filterStatus,
  setFilterStatus,
  statusLabels,
  sortOrders
}) => {
  const uniqueDates = [...new Set(orders.map(o => new Date(o.order_date).toLocaleDateString()))];

  return (
    <div className="order-selector" style={{ marginBottom: '20px' }}>
      <label>訂單日期：</label>
      <select onChange={(e) => setFilterDate(e.target.value)} value={filterDate}>
        <option value="">全部</option>
        {uniqueDates.map(date => (
          <option key={date} value={date}>{date}</option>
        ))}
      </select>

      <label style={{ marginLeft: '20px' }}>訂單狀態：</label>
      <select onChange={(e) => setFilterStatus(e.target.value)} value={filterStatus}>
        <option value="">全部</option>
        {Object.entries(statusLabels).map(([key, label]) => (
          <option key={key} value={key}>{label}</option>
        ))}
      </select>

      <label style={{ marginLeft: '20px' }}>選擇訂單：</label>
      <select
        disabled={filteredOrders.length === 0}
        onChange={(e) => {
          const order = orders.find(o => o.order_id === e.target.value);
          setSelectedOrder(order || null);
        }}
        value={selectedOrder?.order_id || ''}
      >
        {filteredOrders.map(order => (
          <option key={order.order_id} value={order.order_id}>
            {order.order_id}
          </option>
        ))}
      </select>

      <button
        onClick={() => {
          setFilterDate('');
          setFilterStatus('');
          const sorted = sortOrders(orders);
          setSelectedOrder(sorted[0] || null);
        }}
        style={{ marginLeft: '20px' }}
      >
        重新篩選
      </button>
    </div>
  );
};

export default OrderFilterBar;