//src/features/merchant/orders/OrderList.jsx
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import {
  fetchTodayOrders,
  fetchTodayStats,
  updateOrderStatus,
  selectOrders,
  selectOrdersLoading,
  selectOrdersError,
  selectTodayStats
} from './merchantOrdersSlice';
import { useMerchantId } from '../../../hooks/useMerchantId';

const OrderList = () => {
  const dispatch = useDispatch();
  const merchantId = useMerchantId();
  const orders = useSelector(selectOrders);
  const loading = useSelector(selectOrdersLoading);
  const error = useSelector(selectOrdersError);
  const todayStats = useSelector(selectTodayStats);

  const [searchTerm, setSearchTerm] = useState('');

  const STATUS_LABELS = {
    Completed: '已完成',
    Uncompleted: '處理中',
    Abandoned: '已取消'
  };

  const STATUS_COLORS = {
    Completed: 'badge-success',
    Uncompleted: 'badge-warning',
    Abandoned: 'badge-danger'
  };

  useEffect(() => {
    if (!merchantId) return;                 // 等到有 id 再開始輪詢
    dispatch(fetchTodayOrders());
    dispatch(fetchTodayStats());
    const interval = setInterval(() => {
      dispatch(fetchTodayOrders());
      dispatch(fetchTodayStats());
    }, 30000);

    return () => clearInterval(interval);
  }, [dispatch, merchantId]);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await dispatch(updateOrderStatus({ orderId, status: newStatus })).unwrap();
      toast.success(`訂單已更新為：${STATUS_LABELS[newStatus]}`);
    } catch (err) {
      toast.error('訂單狀態更新失敗');
    }
  };

  const formatDateTime = (date) => {
    const d = new Date(date);
    return `${d.toLocaleDateString('zh-TW')} ${d.toLocaleTimeString('zh-TW', { hour: '2-digit', minute: '2-digit' })}`;
  };

  const getTotalQuantity = (items) => {
    return items.reduce((total, item) => total + item.quantity, 0);
  };

  const filteredOrders = orders.filter(order =>
    order.order_id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border" role="status">
          <span className="sr-only">載入中...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="alert alert-danger">載入訂單失敗：{error}</div>;
  }

  return (
    <div className="container-fluid">
      <h4 className="mb-3">今日訂單 - {new Date().toLocaleDateString('zh-TW')}</h4>

      <div className="row mb-3">
        <div className="col-md-4">
          <input
            type="text"
            className="form-control"
            placeholder="搜尋訂單編號..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="row mb-4">
        <div className="col-md-6">
          <div className="alert alert-info">
            今日訂單數：{todayStats.totalOrders || 0} 筆
          </div>
        </div>
        <div className="col-md-6">
          <div className="alert alert-success">
            今日營業額：NT$ {todayStats.totalAmount?.toLocaleString() || 0}
          </div>
        </div>
      </div>

      {filteredOrders.length === 0 ? (
        <p className="text-muted text-center">今日暫無訂單</p>
      ) : (
        filteredOrders.map((order) => (
          <div key={order.order_id} className="card mb-4 shadow-sm">
            <div className="card-header d-flex justify-content-between align-items-center">
              <div>
                <strong>訂單編號：</strong>{order.order_id}
                <br />
                <small className="text-muted">{formatDateTime(order.order_date)}</small>
              </div>

              <div>
                <span className={`badge ${STATUS_COLORS[order.order_status]} me-2`}>
                  {STATUS_LABELS[order.order_status]}
                </span>

                <select
                  className="form-select form-select-sm d-inline w-auto"
                  value={order.order_status}
                  onChange={(e) => handleStatusChange(order.order_id, e.target.value)}
                  disabled={order.order_status === 'Completed'}
                >
                  {Object.entries(STATUS_LABELS).map(([key, label]) => (
                    <option key={key} value={key}>{label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="card-body">
              <p><strong>顧客：</strong>{order.member_name}</p>
              <p><strong>總金額：</strong>NT$ {order.total_amount}</p>
              <p><strong>備註：</strong>{order.remark || '無'}</p>

              <div className="table-responsive">
                <table className="table table-sm table-bordered">
                  <thead className="table-light">
                    <tr>
                      <th>品項</th>
                      <th>單價</th>
                      <th>數量</th>
                      <th>小計</th>
                      <th>備註</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.content.map((item, idx) => (
                      <tr key={idx}>
                        <td>{item.name}</td>
                        <td>NT$ {item.price}</td>
                        <td>{item.quantity}</td>
                        <td>NT$ {item.price * item.quantity}</td>
                        <td>{item.note || '無'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <p className="mt-3"><strong>總數量：</strong>{getTotalQuantity(order.content)} 項</p>
              <p><strong>取餐方式：</strong>{order.pickupMethod === 'eatin' ? '內用' : '自取'}</p>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default OrderList;