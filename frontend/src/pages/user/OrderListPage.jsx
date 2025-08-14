import React, { useState , useContext } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { clearItems, incrementQuantity, decrementQuantity } from '../../redux/orderSlice';
import { useNavigate , useLocation } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { UserContext } from '../../contexts/UserData';
import '../../styles/usercss/OrderListPage.css'

const OrderListPage = () => {
  const orderItems = useSelector((state) => state.order.items);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const merchantId = orderItems[0]?.merchantId; //取第一筆的 merchantId
  const location = useLocation();
  const storeName = location.state?.storeName || ''; 
  const [orderId] = useState(uuidv4().slice(0,8));
  const [pickupMethod, setPickupMethod] = useState("eatin"); // 預設為內用
  const user = useContext(UserContext);
  // 計算總金額
  const total = orderItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  // 處理結帳
  const handleCheckout = async () => {
    const orderData = {
      // 會員名字未來從 cookie 讀取
      order_id: orderId,
      member_name: user.nickName, 
      storename: storeName, // ex: "味佳奇早餐"
      content: orderItems.map(item => ({
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        note: item.remark || ""
      })),
      total_amount: total,
      merchantId : merchantId,
      pickupMethod: pickupMethod,
      member_id: user.member_id
    };
    // 發送訂單到後端
    try {
      const response = await fetch('http://localhost:3001/api/order/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      });

      
      
      // 後端回應
      const result = await response.json();
      if (response.ok) {
        alert(`訂單成功送出！
          \nUUID: ${result.order_id}\n
          總金額：${orderData.total_amount} 元\n
          取餐方式：${pickupMethod}`);
        dispatch(clearItems());
        navigate('/MC/shop');
      } else {
        alert(" 訂單送出失敗！");
      }
    } catch (err) {
      console.error("送出訂單時發生錯誤", err);
      alert("發生錯誤，請稍後再試。");
    }
  };
  

  return (
    <div style={{ padding: '2rem' }}>
      <h2>訂單明細</h2>
      <p><strong>訂單編號：</strong> {orderId}</p>
      <ul>
        {orderItems.map((item, idx) => (
          <li key={idx} style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
            {item.imagePath && (
              <img
                src={item.imagePath}
                alt={item.name}
                style={{ width: '60px', height: '60px', objectFit: 'cover', marginRight: '10px', borderRadius: '8px' }}
              />
            )}
            <div>
              <strong>{item.name}</strong> - ${item.price} x {item.quantity}
              <br />
              備註：{item.remark}
              <div style={{ marginTop: '4px' }}>
                <button onClick={() => dispatch(decrementQuantity(idx))}>➖</button>
                <button onClick={() => dispatch(incrementQuantity(idx))}>➕</button>
              </div>
            </div>
          </li>
        ))}
      </ul>
      <div className="pickup-method" style={{ marginTop: '1rem' }}>
        <p><strong>取餐方式：</strong></p>
        <label>
          <input
            type="radio"
            name="eatin"
            value="eatin"
            checked={pickupMethod === "eatin"}
            onChange={() => setPickupMethod("eatin")}
          />
          內用
        </label>
        <label>
          <input
            type="radio"
            name="pickup"
            value="pickup"
            checked={pickupMethod === "pickup"}
            onChange={() => setPickupMethod("pickup")}
          />
          自取
        </label>
      </div>


      <h3>總金額：${total}</h3>

      <div style={{ marginTop: '1.5rem' }}>
      <button
        className="continue-btn"
        onClick={() => navigate(`/user/menu/${merchantId}`)}
      >
          繼續點餐
        </button>
        <button className="checkout-btn" onClick={handleCheckout}>
         結帳
        </button>
      </div>
    </div>
  );
};

export default OrderListPage;
