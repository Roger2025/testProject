// hooks/useOrderActions.js
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export const useOrderActions = (selectedOrder, reloadOrders) => {
  const navigate = useNavigate();

  const handleCancelOrder = () => {
    if (!selectedOrder) return;
    axios.patch(`/api/orders/${selectedOrder._id}`, {
      order_status: 'Cancelled'
    })
    .then(() => {
      alert('訂單已取消');
      reloadOrders?.();
    })
    .catch(() => alert('取消失敗'));
  };

  const handleReorder = () => {
    if (!selectedOrder) return;
    navigate('/cart', { state: { items: selectedOrder.content } });
  };

  return { handleCancelOrder, handleReorder };
};