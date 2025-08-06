// src/components/cart/OrderTabel.js (訂單表格)

import { useState } from 'react';

// 透過後端 Node.js /public/images/ 下載圖片
// 必須先打開 Node.js 伺服器 localhost:3001/images/merchant1
export const getImageURL = (modulePath) => {
  return `http://localhost:3001/images/merchant1/${modulePath}`;
};

const initialOrderItems = [
  { id: 1, name: '鮪魚吐司', price: 45, quantity: 2, img: getImageURL('toast/toast05.jpg') },
  { id: 2, name: '奶茶', price: 20, quantity: 1, img: getImageURL('drinks/drinks02.jpg') },
  { id: 3, name: '蘿蔔糕', price: 40, quantity: 1, img: getImageURL('single/single03.jpg') },  

//   { id: 1, name: '火腿蛋吐司', price: 45, quantity: 2, img: require('../../assets/images/cart/cart-1.jpg') },
//   { id: 2, name: '奶茶', price: 30, quantity: 1, img: require('../../assets/images/cart/cart-2.jpg') },
//   { id: 3, name: '蘿蔔糕', price: 40, quantity: 1, img: require('../../assets/images/cart/cart-3.jpg') },    
];

export default function OrderTable() {
  const [orderItems, setOrderItems] = useState(initialOrderItems);

  const updateQuantity = (id, value) => {
    setOrderItems(prev =>
      prev.map(item =>
        item.id === id ? { ...item, quantity: Number(value) } : item
      )
    );
  };

  const removeItem = id => {
    setOrderItems(prev => prev.filter(item => item.id !== id));
  };

  const calculateTotal = () =>
    orderItems.reduce((acc, item) => acc + item.price * item.quantity, 0).toFixed(2);

  return (
    <section className="shoping-cart spad">
      <div className="container">

        <div className="order-number">訂單號碼 : 1</div>

        <div className="shoping__cart__table">
          <table>
            <thead>
              <tr>
                <th>品項</th>
                <th>價格</th>
                <th>數量</th>
                <th>總計</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {orderItems.map(item => (
                <tr key={item.id}>
                  <td className="shoping__cart__item">
                    {/* <img src={item.img} alt={item.name} /> */}
                    <h5>{item.name}</h5>
                  </td>
                  <td>${item.price.toFixed(2)}</td>
                  <td>
                    {/* <div className="quantity">
                      <input
                        type="number"
                        value={item.quantity}
                        min="1"
                        onChange={e => updateQuantity(item.id, e.target.value)}
                      />
                    </div> */}
                    {item.quantity}
                  </td>
                  <td>${(item.price * item.quantity).toFixed(2)}</td>
                  {/* <td>
                    <button onClick={() => removeItem(item.id)}>
                      <span className="icon_close"></span>
                    </button>
                  </td> */}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="shoping__cart__btns">
          <button className="primary-btn cart-btn">檢視交易內容</button>
          <button className="primary-btn cart-btn cart-btn-right">再訂一次</button>
        </div>

        {/* <div className="shoping__cart__btns">
          <button className="primary-btn cart-btn cart-btn-right">確認訂單</button>
          <button className="primary-btn cart-btn cart-btn-right">取消訂單</button>
          <button className="primary-btn cart-btn cart-btn-right">再訂一次</button>
          <button className="primary-btn cart-btn ">檢視交易內容</button>
        </div> */}

        <div className="row">
          <div className="col-lg-6">
           <div className="order-status">       
            <h5>取餐方式</h5>
                <span class="badge pending">自取</span>
                <span class="badge confirmed">預約</span>
                <span class="badge delivered">內用</span>
            <br/>
            <br/>
            <h5>訂單狀態</h5>
                <span class="badge pending">待處理</span>
                <span class="badge confirmed">已確認</span>
                <span class="badge delivered">已送達</span>
            </div>
          </div>

          <div className="col-lg-6">
            <div className="shoping__checkout"> 
              <h5>訂單總金額</h5>
              <ul>
                <li>小計 <span>${calculateTotal()}</span></li>
                <li>總計 <span>${calculateTotal()}</span></li>
              </ul>
              {/* <button className="primary-btn">送出訂單</button> */}
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}