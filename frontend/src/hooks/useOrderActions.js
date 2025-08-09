// hooks/useOrderActions.js
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// const api = axios.create({
//   baseURL: process.env.REACT_APP_API_BASE
// });

export const useOrderActions = (selectedOrder = {}, reloadOrders) => {
  const navigate = useNavigate();
  
  const { order_id, content = [] } = selectedOrder || {};

  const handleCancelOrder = () => {
    if (!order_id) return;

    // debug
    const url = `http://localhost:3001/api/home/order/${order_id}/cancel`;
    console.log('Sending PATCH to:', url);

    // axios.patch(`${process.env.REACT_APP_API_BASE}/api/home/order/${selectedOrder.order_id}/cancel`)
    // api.patch(`/api/home/order/${selectedOrder.order_id}/cancel`)

    axios.patch(url)
    .then(() => {
      alert('訂單已取消');
      reloadOrders?.();
    })
    .catch(() => alert('取消失敗'));
  };

  const handleReorder = () => {
    if (!content) return;
    navigate('/shopcart', { state: { items: content } });
  };

  return { handleCancelOrder, handleReorder };
};