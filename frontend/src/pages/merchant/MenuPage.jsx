// src/pages/merchant/MenuPage.jsx
import React from 'react';
import MenuList from '../../features/merchant/menu/MenuList';
import SetMenuList from '../../features/merchant/setMenu/SetMenuList';

const MenuPage = () => {
  return (
    <div className="container mt-4">
      <h2 className="mb-4">菜單管理</h2>

      <section className="mb-5">
        <h4>單一品項</h4>
        <MenuList />
      </section>

      <section>
        <h4>套餐</h4>
        <SetMenuList />
      </section>
    </div>
  );
};

export default MenuPage;
