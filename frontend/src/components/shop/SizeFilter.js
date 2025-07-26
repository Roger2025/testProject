// ogani : shop-grid.html :　Pduct Section（第1-4部分）
// SizeFilter.js
// Path = components/shop/
import React from 'react';
// import './SizeFilter.css'; // 可選：放 Ogani 對應樣式

const sizes = ['Large', 'Medium', 'Small', 'Tiny'];

const SizeFilter = ({ selectedSize, onChange }) => {
  return (
    <div className="sidebar__item">
      <h4>Popular Size</h4>
      {sizes.map((size) => (
        <div key={size} className="sidebar__item__size">
          <label htmlFor={size.toLowerCase()}>
            {size}
            <input
              type="radio"
              id={size.toLowerCase()}
              name="size"
              checked={selectedSize === size}
              onChange={() => onChange(size)}
            />
          </label>
        </div>
      ))}
    </div>
  );
};

export default SizeFilter;