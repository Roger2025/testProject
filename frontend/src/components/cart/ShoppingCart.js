import { useState } from 'react';
// import './ShoppingCart.css';

// 透過後端 Node.js /public/images/ 下載圖片
// 必須先打開 Node.js 伺服器 localhost:3001/images/merchant1
export const getImageURL = (modulePath) => {
  return `http://localhost:3001/images/merchant1/${modulePath}`;
};

const initialCartItems = [
  { id: 1, name: '鮪魚吐司', price: 45, quantity: 2, img: getImageURL('toast/toast05.jpg') },
  { id: 2, name: '奶茶', price: 20, quantity: 1, img: getImageURL('drinks/drinks02.jpg') },
  { id: 3, name: '蘿蔔糕', price: 40, quantity: 1, img: getImageURL('single/single03.jpg') },  

//   { id: 1, name: '火腿蛋吐司', price: 45, quantity: 2, img: require('../../assets/images/cart/cart-1.jpg') },
//   { id: 2, name: '奶茶', price: 30, quantity: 1, img: require('../../assets/images/cart/cart-2.jpg') },
//   { id: 3, name: '蘿蔔糕', price: 40, quantity: 1, img: require('../../assets/images/cart/cart-3.jpg') },    
];

export default function ShoppingCart() {
  const [cartItems, setCartItems] = useState(initialCartItems);

  const updateQuantity = (id, value) => {
    setCartItems(prev =>
      prev.map(item =>
        item.id === id ? { ...item, quantity: Number(value) } : item
      )
    );
  };

  const removeItem = id => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  const calculateTotal = () =>
    cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0).toFixed(2);

  return (
    <section className="shoping-cart spad">
      <div className="container">
        <div className="shoping__cart__table">
          <table>
            <thead>
              <tr>
                <th>品項</th>
                <th>價格</th>
                <th>數量</th>
                <th>總計</th>
                <th>刪除</th>
              </tr>
            </thead>
            <tbody>
              {cartItems.map(item => (
                <tr key={item.id}>
                  <td className="shoping__cart__item">
                    {/* <img src={item.img} alt={item.name} /> */}
                    <h5>{item.name}</h5>
                  </td>
                  <td>${item.price.toFixed(2)}</td>
                  <td>
                    <div className="quantity">
                      <input
                        type="number"
                        value={item.quantity}
                        min="1"
                        onChange={e => updateQuantity(item.id, e.target.value)}
                      />
                    </div>
                  </td>
                  <td>${(item.price * item.quantity).toFixed(2)}</td>
                  <td>
                    <button onClick={() => removeItem(item.id)}>
                      <span className="icon_close"></span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="shoping__cart__btns">
          <button className="primary-btn cart-btn">繼續購物</button>
          <button className="primary-btn cart-btn cart-btn-right">
            <span className="icon_loading"></span> 更新購物車
          </button>
        </div>

        <div className="row">
          <div className="col-lg-6">
            <div className="shoping__discount">
              <h5>優惠代碼</h5>
              <form onSubmit={e => e.preventDefault()}>
                <input type="text" placeholder="輸入您的優惠券代碼" />
                <button className="site-btn">使用優惠券</button>
              </form>
            </div>
          </div>

          <div className="col-lg-6">
            <div className="shoping__checkout">
              <h5>購物車總計</h5>
              <ul>
                <li>小計 <span>${calculateTotal()}</span></li>
                <li>總計 <span>${calculateTotal()}</span></li>
              </ul>
              <button className="primary-btn">送出訂單</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}