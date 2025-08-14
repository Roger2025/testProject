import React, { useEffect, useState,useContext } from "react";
import { useDispatch, useSelector, useStore, shallowEqual } from 'react-redux';
import { useParams, useNavigate } from "react-router-dom";
import { addItem, incrementQuantity, decrementQuantity } from '../../redux/orderSlice';
import { UserContext } from '../../contexts/UserData';
import "../../styles/usercss/MenuPage.css";


const MenuPage = () => {
  const { merchantId } = useParams();
  const [storeInfo, setStoreInfo] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("全部");
  const [categories, setCategories] = useState([]);
  const [remarks, setRemarks] = useState({});
  //-------------------------抓取cookie 使用者資訊-----------------------------------
  const user = useContext(UserContext);
    const displayName =
    user?.nickName ??
    user?.nickname ??
    user?.name ??
    user?.username ??
    user?.member_name ??
    user?.memberName ??
    "";
  //---------------------------------------------------------------
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const orderItems = useSelector((state) => state.order?.items) ;
  // 取得訂單中的餐廳名稱
  useEffect(() => {
    const fetchMenuData = async () => {
      try {
        const res = await fetch(`http://localhost:3001/api/user/shop/${merchantId}`);
        const data = await res.json();
        setStoreInfo(data.storeInfo);
        setMenuItems(data.menu);

        const uniqueCategories = [...new Set(data.menu.map(item => item.category))];
        setCategories(["全部", ...uniqueCategories]);
      } catch (err) {
        console.error("抓取菜單失敗：", err);
      }
    };

    fetchMenuData();
  }, [merchantId]);

  // 備註輸入
  const handleRemarkChange = (index, value) => {
    setRemarks((prev) => ({
      ...prev,
      [index]: value,
    }));
  };
  // 新增餐點到訂單
  const handleAddToOrder = (item, index) => {
    const orderItem = {
      ...item,
      remark: remarks[index] || "",
      quantity: 1,
      merchantId, 
    };
    console.log('[ADD]', orderItem);
    dispatch(addItem(orderItem));
  };

  useEffect(() => {
    console.log('[orderItems]', orderItems);
  }, [orderItems]);

  
  // 分類
  const filteredMenu = selectedCategory === "全部" ? menuItems
    : menuItems.filter(item => item.category === selectedCategory);


  return (
    <div className="menu-page-container">
      {storeInfo && (
        <div className="store-info">
          {user ? (
            <div className="user-info" style={{ marginBottom: '1rem' }}>
               使用者：{displayName || "（未提供名稱）"}
            </div>
          ) : (
            <div className="user-info" style={{ marginBottom: '1rem' }}>
               使用者載入中…
            </div>
          )}
          <h2>{storeInfo.storeName}</h2>
          <p>地址：{storeInfo.storeAddress}</p>
          <p>📞 電話：{storeInfo.storePhone}</p>
        </div>
      )}

      <div className="category-filter">
        {categories.map((category, idx) => (
          <button
            key={idx}
            className={`category-button ${selectedCategory === category ? "active" : ""}`}
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="menu-container">
        {filteredMenu.map((item, index) => (
          <div className="menu-card" key={index}>
            <img src={item.imagePath} alt={item.name} className="menu-image" />
            <div className="menu-content">
              <h3>{item.name}</h3>
              <p className="menu-price">價格：${item.price}</p>
              <textarea
                className="menu-remark"
                placeholder="輸入備註（如：加蛋、少糖...）"
                value={remarks[index] || ""}
                onChange={(e) => handleRemarkChange(index, e.target.value)}
              />
              <button
                disabled={!item.available}
                className={`add-button ${item.available ? "" : "disabled"}`}
                onClick={() => handleAddToOrder(item, index)}
              >
                {item.available ? "加入餐點" : "已售完"}
              </button>
            </div>
          </div>
        ))}
      </div>

      {orderItems.length > 0 && (
        <div className="floating-box">
          <h4>已加入餐點</h4>
          <ul style={{ fontSize: "12px", margin: 0, paddingLeft: "1rem" }}>
            {orderItems.map((item, idx) => (
              <li key={idx} style={{ marginBottom: '6px' }}>
                {item.name} - ${item.price} x {item.quantity}
                <br />
                <em>{item.remark}</em>
                <div>
                  <button onClick={() => dispatch(decrementQuantity(idx))}>➖</button>
                  <button onClick={() => dispatch(incrementQuantity(idx))}>➕</button>
                </div>
              </li>
            ))}
          </ul>
          <button className="confirm-btn" onClick={() => 
            navigate('../order-list', {
              state: {
                storeName: storeInfo.storeName, // 餐廳名稱
                items: orderItems,              // 如果你也要傳整包資料，可以一起帶
              },
            })}
          >
            確認訂單
          </button>
        </div>
      )}
    </div>
  );
};

export default MenuPage;
