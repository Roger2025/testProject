import { createContext, useContext, useState } from "react";

// 建立 context 實體
const OrderContext = createContext();

// 自定義 Hook
export const useOrder = () => useContext(OrderContext);

// 提供元件包裝
export const OrderProvider = ({ children }) => {
  const [orderItems, setOrderItems] = useState([]);

  const addItem = (name, options = [], note = "", price = 0, uu_id="") => {
    setOrderItems((prev) => [
      ...prev,
      { name, options, note, price, uu_id }
    ]);
  };

  /**
   * 清空整筆訂單
   */
  const clearOrder = () => {
    setOrderItems([]);
  };

  /**
   * （可選）根據索引移除某一筆餐點
   */
  const removeItemByIndex = (index) => {
    setOrderItems((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <OrderContext.Provider value={{
      orderItems,
      addItem,
      clearOrder,
      removeItemByIndex
    }}>
      {children}
    </OrderContext.Provider>
  );
};
