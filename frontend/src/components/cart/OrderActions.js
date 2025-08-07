// src/components/cat/OrderActions.js

import React from 'react';

const OrderActions = ({ order, onCancel, onReorder }) => {
  if (!order) return null;

  const { order_status } = order;

  const isCancelable = order_status === 'Uncompleted';
  const isReorderable = ['Accepted', 'Completed', 'Cancelled', 'Closed'].includes(order_status);
  const isReadonly = ['Cancelled', 'Closed'].includes(order_status);

  return (
    <div className="order-actions">
      {isCancelable && (
        <button className="primary-btn danger-btn" onClick={onCancel}>
          取消訂單
        </button>
      )}

      {isReorderable && (
        <button
          className="primary-btn cart-btn cart-btn-right"
          onClick={onReorder}
          disabled={isReadonly}
          title={isReadonly ? '此訂單已結束，無法變更原訂單' : ''}
        >
          再訂一次
        </button>
      )}
    </div>
  );
};

export default OrderActions;