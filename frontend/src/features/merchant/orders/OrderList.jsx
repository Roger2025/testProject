import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { 
fetchTodayOrders, 
updateOrderStatus,
selectOrders,
selectOrdersLoading,
selectOrdersError,
selectTodayStats
} from './merchantOrdersSlice';


const OrderList = () => {
const dispatch = useDispatch();
const orders = useSelector(selectOrders);
const loading = useSelector(selectOrdersLoading);
const error = useSelector(selectOrdersError);
const todayStats = useSelector(selectTodayStats);
const [searchTerm, setSearchTerm] = useState('');

// 訂單狀態選項
const ORDER_STATUS = {
PENDING: '待處理',
CONFIRMED: '已確認',
PREPARING: '製作中',
READY: '待取餐',
COMPLETED: '已完成',
CANCELLED: '已取消'
};

// 狀態顏色對應
const getStatusBadgeClass = (status) => {
const statusClasses = {
    PENDING: 'badge-warning',
    CONFIRMED: 'badge-info',
    PREPARING: 'badge-primary',
    READY: 'badge-success',
    COMPLETED: 'badge-secondary',
    CANCELLED: 'badge-danger'
};
return statusClasses[status] || 'badge-secondary';
};

useEffect(() => {
// 載入今日訂單
dispatch(fetchTodayOrders());

// 設置輪詢檢查新訂單（每30秒檢查一次）
const interval = setInterval(() => {
    dispatch(fetchTodayOrders());
}, 30000);

return () => clearInterval(interval);
}, [dispatch]);

// 處理訂單狀態更新
const handleStatusChange = async (orderId, newStatus) => {
try {
    await dispatch(updateOrderStatus({ orderId, status: newStatus })).unwrap();
    toast.success(`訂單狀態已更新為：${ORDER_STATUS[newStatus]}`);
} catch (error) {
    toast.error('更新訂單狀態失敗');
    console.error('Error updating order status:', error);
}
};

// 格式化時間顯示
const formatTime = (dateString) => {
const date = new Date(dateString);
return date.toLocaleTimeString('zh-TW', { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: false 
});
};

// 格式化日期顯示
const formatDate = (dateString) => {
const date = new Date(dateString);
return date.toLocaleDateString('zh-TW');
};

// 計算訂單項目總數量
const getTotalQuantity = (content) => {
return content.reduce((total, item) => total + item.quantity, 0);
};

//新增搜尋邏輯
const filteredOrders = orders.filter((order) =>
order.order_id.toLowerCase().includes(searchTerm.toLowerCase())
);

if (loading) {
return (
    <div className="container-fluid">
    <div className="d-flex justify-content-center align-items-center" style={{ height: '300px' }}>
        <div className="spinner-border" role="status">
        <span className="sr-only">載入中...</span>
        </div>
    </div>
    </div>
);
}

if (error) {
return (
    <div className="container-fluid">
    <div className="alert alert-danger" role="alert">
        載入訂單失敗：{error}
    </div>
    </div>
);
}

return (
<div className="container-fluid">
    <div className="row">
    <div className="col-12">
        <div className="card">
        <div className="card-header">
            <h4 className="card-title mb-0">
            今日訂單管理 - {formatDate(new Date())}
            </h4>
        </div>
        
        <div className="card-body">

            {/* 新增搜尋欄位 */}
            <div className="row mb-3">
                <div className="col-md-6">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="搜尋訂單編號..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* 今日統計資訊 */}
            <div className="row mb-4">
            <div className="col-md-6">
                <div className="alert alert-info">
                <strong>今日訂單總筆數：</strong>{todayStats.totalOrders} 筆
                </div>
            </div>
            <div className="col-md-6">
                <div className="alert alert-success">
                <strong>今日總營業額：</strong>NT$ {todayStats.totalAmount?.toLocaleString() || 0}
                </div>
            </div>
            </div>

            {/* 訂單列表 */}
            {filteredOrders.length === 0 ? (
            <div className="text-center py-5">
                <h5 className="text-muted">今日暫無訂單</h5>
            </div>
            ) : (
            <div className="row">
                {filteredOrders.map((order) => (
                <div key={order.order_id} className="col-12 mb-4">
                    <div className="card border-left-primary">
                        <div className="card-header">
                            <div className="row align-items-center">
                                <div className="col-md-3">
                                    <h6 className="mb-0">
                                    訂單編號：{order.order_id}
                                    </h6>
                                    <small className="text-muted">
                                    {formatTime(order.order_date)}
                                    </small>
                                </div>
                                <div className="col-md-3">
                                    <strong>顧客：</strong>{order.member_name}
                                </div>
                                <div className="col-md-2">
                                    <strong>總金額：</strong>
                                    <span className="text-success">
                                    NT$ {order.total_amount}
                                    </span>
                                </div>
                                <div className="col-md-2">
                                    <span className={`badge ${getStatusBadgeClass(order.order_status)}`}>
                                    {ORDER_STATUS[order.order_status]}
                                    </span>
                                </div>
                                <div className="col-md-2">
                                    <select 
                                    className="form-control form-control-sm"
                                    value={order.order_status}
                                    onChange={(e) => handleStatusChange(order.order_id, e.target.value)}
                                    disabled={order.order_status === 'COMPLETED' || order.order_status === 'CANCELLED'}
                                    >
                                    {Object.entries(ORDER_STATUS).map(([key, value]) => (
                                        <option key={key} value={key}>{value}</option>
                                    ))}
                                    </select>
                                    
                                    {/* 狀態按鈕 */}
                                    <div className="d-flex gap-1">
                                        <button
                                        className="btn btn-sm btn-success w-100"
                                        onClick={() => handleStatusChange(order.order_id, 'COMPLETED')}
                                        disabled={order.order_status === 'COMPLETED' || order.order_status === 'CANCELLED'}
                                        >
                                        完成
                                        </button>
                                        <button
                                        className="btn btn-sm btn-danger w-100"
                                        onClick={() => handleStatusChange(order.order_id, 'CANCELLED')}
                                        disabled={order.order_status === 'COMPLETED' || order.order_status === 'CANCELLED'}
                                        >
                                        取消
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    
                    <div className="card-body">
                        <h6 className="card-subtitle mb-2 text-muted">
                        訂單內容（共 {getTotalQuantity(order.content)} 項商品）
                        </h6>
                        <div className="table-responsive">
                        <table className="table table-sm">
                            <thead>
                            <tr>
                                <th>商品名稱</th>
                                <th>單價</th>
                                <th>數量</th>
                                <th>小計</th>
                                <th>備註</th>
                            </tr>
                            </thead>
                            <tbody>
                            {order.content.map((item, index) => (
                                <tr key={index}>
                                <td>{item.name}</td>
                                <td>NT$ {item.price}</td>
                                <td>{item.quantity}</td>
                                <td>NT$ {item.price * item.quantity}</td>
                                <td>
                                    {item.note ? (
                                    <small className="text-muted">{item.note}</small>
                                    ) : (
                                    <small className="text-muted">無</small>
                                    )}
                                </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                        </div>
                    </div>
                    </div>
                </div>
                ))}
            </div>
            )}
        </div>
        </div>
    </div>
    </div>
</div>
);
};

export default OrderList;