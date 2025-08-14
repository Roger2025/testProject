// src/pages/StorePage.js
import React from "react";
import { Link } from "react-router-dom";

const StorePage = () => {
  const stores = [
    { id: "662f41ac1234567890abcde1", name: "味佳奇早餐" },
    { id: "store5", name: "囍宅豆漿" },
    { id: "store6", name: "Q比早午餐" },
    { id: "store7", name: "弘爺漢堡 朋芮店" },
    { id: "store8", name: "巨林美而美" },
    { id: "default_merchant", name:"瑞麟美而美延平二店"},
    { id: "store9", name: "早吧 Morning Bar" },
  ];

  return (
    <div style={{ padding: "1rem" }}>
      <h2>請選擇餐廳開始點餐</h2>
      <ul>
        {stores.map((store) => (
          <li key={store.id}>
            <Link to={`/user/menu/${store.id}`}>{store.name}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default StorePage;
