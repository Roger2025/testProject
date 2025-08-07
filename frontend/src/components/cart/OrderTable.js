// src/components/cart/OrderTabel.js (訂單表格)

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import OrderFilterBar from './OrderFilterBar';
import OrderActions from './OrderActions';
import { useOrderActions } from '../../hooks/useOrderActions'; 

const pickupLabels = {
  Takeout: '自取',
  eatin: '內用'
};

const pickupClasses = {
  Takeout: 'takeout',
  eatin: 'eatin'
};

const statusLabels = {
  Uncompleted: '未完成',
  Completed: '已完成',
  Closed: '已結單',
  Cancelled: '已取消'
};

const statusClasses = {
  Uncompleted: 'uncompleted',
  Completed: 'completed',
  Closed: 'closed',
  Cancelled: 'cancelled'
};

// 取得圖片 URL
export const getImageURL = (modulePath) => {
  return `http://localhost:3001/images/${modulePath}`;
};

const defaultImageURL = 'http://localhost:3001/images/ByteEat.png'; // 平台的 logo 路徑

export default function OrderTable() {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [filterDate, setFilterDate] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  const navigate = useNavigate();

  const filteredOrders = orders.filter(order => {
    const matchDate = filterDate ? new Date(order.order_date).toLocaleDateString() === filterDate : true;
    const matchStatus = filterStatus ? order.order_status === filterStatus : true;
    return matchDate && matchStatus;
  });  

  const sortOrders = (orders = []) => {
    const statusPriority = {
      Uncompleted: 1,
      Accepted: 2,
      Completed: 3,
      Closed: 4,
      Cancelled: 5
    };
    // ✅ 排序邏輯：下訂日期（新）> 狀態（未處理）> 訂單號碼（大）
    return [...orders].sort((a, b) => {
      const dateA = new Date(a.order_date);
      const dateB = new Date(b.order_date);
      // 1. 日期（新到舊）
      if (dateA < dateB) return 1;
      if (dateA > dateB) return -1;
      // 2. 狀態（未完成優先）
      const statusA = statusPriority[a.order_status] || 99;
      const statusB = statusPriority[b.order_status] || 99;
      if (statusA !== statusB) return statusA - statusB;
      // 3. 訂單號碼（大到小）
      return (b.order_id || '').localeCompare(a.order_id || '');
    });
  };

  const loadOrders = () => {
    axios.get('http://localhost:3001/api/orders')
      .then(res => {
        const data = Array.isArray(res.data) ? res.data : [res.data];
        const sorted = sortOrders(data);
        setOrders(sorted);
        setSelectedOrder(sorted[0] || null);
        setFilterDate('');
        setFilterStatus('');
      })
      .catch(err => {
        console.error('載入訂單失敗', err);
        setOrders([]);
        setSelectedOrder(null);
      });
  }

  // 🔄 載入訂單資料
  useEffect(() => {
    loadOrders();
  }, []);

  const { handleCancelOrder, handleReorder } = useOrderActions(selectedOrder, loadOrders);

  // ✅ 當篩選條件變化時，自動選擇第一筆符合條件的訂單
  useEffect(() => {
    if (filteredOrders.length > 0) {
      setSelectedOrder(filteredOrders[0]);
    } else {
      setSelectedOrder(null);
    }
  }, [filterDate, filterStatus]); // ← 這裡是關鍵

  if (!orders.length) {
    return <div>載入中...</div>;
  }

  if (!filteredOrders.length) {
    return (
      <section className="shoping-cart spad">
        <div className="container">
          <OrderFilterBar
            orders={orders}
            filteredOrders={filteredOrders}
            selectedOrder={selectedOrder}
            setSelectedOrder={setSelectedOrder}
            filterDate={filterDate}
            setFilterDate={setFilterDate}
            filterStatus={filterStatus}
            setFilterStatus={setFilterStatus}
            statusLabels={statusLabels}
            sortOrders={sortOrders}
          />
          <div style={{ padding: '40px', textAlign: 'center', color: '#888' }}>
            找不到符合條件的訂單，請重新篩選。
          </div>
        </div>
      </section>
    );
  }

  const calculateTotal = () => {
    if (!selectedOrder?.content?.length) return '0.00';
    return selectedOrder.content
      .reduce((acc, item) => acc + item.price * item.quantity, 0)
      .toFixed(2);
  };

  return (
    <section className="shoping-cart spad">
      <div className="container">
        {/* 🔄 訂單選擇器 */}
        <OrderFilterBar
          orders={orders}
          filteredOrders={filteredOrders}
          selectedOrder={selectedOrder}
          setSelectedOrder={setSelectedOrder}
          filterDate={filterDate}
          setFilterDate={setFilterDate}
          filterStatus={filterStatus}
          setFilterStatus={setFilterStatus}
          statusLabels={statusLabels}
          sortOrders={sortOrders}
        />

        {/* ✅ 額外資訊 */}
        {selectedOrder && (
          <div className="row">
            <div className="col-lg-6">
              <div className="order-info">
                <div className="order-title">早餐店：{selectedOrder.storename}</div>
                <div className="order-number">訂單號碼：{selectedOrder.order_id}</div>
                <div>消費者：{selectedOrder.member_name}</div>
              </div>
            </div>  
            <div className="col-lg-6">
              <div className="order-status">
                <h5>取餐方式：
                <span className={`badge ${pickupClasses[selectedOrder.pickupMethod]}`}>
                  {pickupLabels[selectedOrder.pickupMethod]}
                </span>
                </h5>
                <h5>訂單狀態：
                <span className={`badge ${statusClasses[selectedOrder.order_status]}`}>
                  {statusLabels[selectedOrder.order_status]}
                </span>
                <span className="shoping__cart__btns">
                  {/* <button className="primary-btn cart-btn cart-btn-right">再訂一次</button> */}
                  <OrderActions
                    order={selectedOrder}
                    onCancel={handleCancelOrder}
                    onReorder={handleReorder}
                  />
                </span>                
                </h5>
              </div>
            </div>  
          </div>
        )}    

        {selectedOrder?.content?.length > 0 && (
          <div className="shoping__cart__table">
            <table>
              <thead>
                <tr>
                  <th>品項</th>
                  <th>備註</th>
                  <th>價格</th>
                  <th>數量</th>
                  <th>總計</th>
                </tr>
              </thead>
              <tbody>
                {selectedOrder.content.map((item, index) => (
                  <tr key={index}>
                    <td className="shoping__cart__item">
                      <img 
                        src={item.img ? getImageURL(item.img) : defaultImageURL}
                        alt={item.name} 
                        style={{ width: '80px' }} 
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = defaultImageURL;
                          }}
                      />
                      <h5>{item.name}</h5>
                    </td>
                    <td className="shoping__cart__note">{item.note}</td>
                    <td>${item.price.toFixed(2)}</td>
                    <td>{item.quantity}</td>
                    <td>${(item.price * item.quantity).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {selectedOrder && (
          <div className="row">
            <div className="col-lg-6">
            </div>
            <div className="col-lg-6">
              <div className="shoping__checkout">
                <h5>訂單總金額</h5>
                <ul>
                  <li>總計 <span>${calculateTotal()}</span></li>
                </ul>
              </div>
            </div>
          </div>
        )}

      </div>
    </section>
  );
}