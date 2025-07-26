// ogani : shop-grid.html :　Pduct Section（第1-3部分）
// ColorFilter.js
// Path = components/shop/

import React, { useState } from 'react';
// import './ColorFilter.css'; // 可選：放置原 Ogani 顏色樣式

const colors = [
  { id: 'white', label: 'White', className: 'sidebar__item__color--white' },
  { id: 'gray', label: 'Gray', className: 'sidebar__item__color--gray' },
  { id: 'red', label: 'Red', className: 'sidebar__item__color--red' },
  { id: 'black', label: 'Black', className: 'sidebar__item__color--black' },
  { id: 'blue', label: 'Blue', className: 'sidebar__item__color--blue' },
  { id: 'green', label: 'Green', className: 'sidebar__item__color--green' },
];

const ColorFilter = ({ selectedColor, onChange }) => {
  const handleChange = (colorId) => {
    onChange(colorId);
  };

  return (
    <div className="sidebar__item sidebar__item__color--option">
      <h4>Colors</h4>
      {colors.map((color) => (
        <div
          key={color.id}
          className={`sidebar__item__color ${color.className}`}
        >
          <label htmlFor={color.id}>
            {color.label}
            <input
              type="radio"
              id={color.id}
              name="color"
              checked={selectedColor === color.id}
              onChange={() => handleChange(color.id)}
            />
          </label>
        </div>
      ))}
    </div>
  );
};

export default ColorFilter;