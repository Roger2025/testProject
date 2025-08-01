// ogani : shop-grid.html :　Product Section（第1-1部分）
// ProductSidebar.js
// Path = components/shop/
import React, { useState } from 'react';
// import './ProductSidebar.css'; // 若需樣式覆寫可放入此 CSS
// import DepartmentFilter from './DepartmentFilter'; // ???
import PriceRangeFilter from './PriceRangeFilter';
import ColorFilter from './ColorFilter';
import SizeFilter from './SizeFilter';

const departments = [
  '會員資訊',
  '訂餐專區',
  '支付管理',
  '優惠專區',
  '評價與收藏',
  '客戶服務',
  '聯絡我們',
  // '套餐',
  // '漢堡',
  // '吐司',
  // '蛋餅',
  // '鬆餅',
  // '麵食',
  // '單品',
  // '飲品',
  // 'Papayaya & Crisps',
  // 'Oatmeal',
];

const ProductSidebar = () => {
  // const [selectedColor, setSelectedColor] = useState('');  
  // const [selectedSize, setSelectedSize] = useState('');
  
  return (
    <div className="sidebar">
      <div className="sidebar__item">
        <h4>會員中心</h4>
        <ul>
          {departments.map((dept, index) => (
            <li key={index}>
              <a href="#">{dept}</a>
            </li>
          ))}
        </ul>

      {/* <DepartmentFilter /> */}
      {/* <PriceRangeFilter /> */}
      {/* <ColorFilter
        selectedColor={selectedColor}
        onChange={setSelectedColor}
      /> */}

      {/* <SizeFilter selectedSize={selectedSize} onChange={setSelectedSize} /> */}

      </div>
    </div>

  );
};

export default ProductSidebar;