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
  '套餐',
  '漢堡',
  '吐司',
  '蛋餅',
  '鬆餅',
  '麵食',
  '單品',
  '飲品',
  // 'Papayaya & Crisps',
  // 'Oatmeal',
];

const ProductSidebar = () => {
  const [selectedColor, setSelectedColor] = useState('');  
  const [selectedSize, setSelectedSize] = useState('');
  
  return (
    <div className="sidebar">
      <div className="sidebar__item">
        <h4>Department</h4>
        <ul>
          {departments.map((dept, index) => (
            <li key={index}>
              <a href="#">{dept}</a>
            </li>
          ))}
        </ul>

      {/* <DepartmentFilter /> */}
      <PriceRangeFilter />
      <ColorFilter
        selectedColor={selectedColor}
        onChange={setSelectedColor}
      />

      <SizeFilter selectedSize={selectedSize} onChange={setSelectedSize} />

      </div>
    </div>

  );
};

export default ProductSidebar;