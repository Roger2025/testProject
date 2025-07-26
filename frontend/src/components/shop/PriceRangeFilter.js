// ogani : shop-grid.html :　Pduct Section（第1-2部分）
// PriceRangeFilter.js
// Path = components/shop/

// 安裝互動式滑桿套件（選一種）
// npm install rc-slider 或 npm install react-range
// 用 rc-slider 範例

import React, { useState } from 'react';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

const PriceRangeFilter = () => {
  const [priceRange, setPriceRange] = useState([10, 540]);

  const handleSliderChange = (value) => {
    setPriceRange(value);
  };

  return (
    <div className="sidebar__item">
      <h4>Price</h4>
      <div className="price-range-wrap">
        <Slider
          range
          min={10}
          max={540}
          value={priceRange}
          onChange={handleSliderChange}
        />
        <div className="range-slider">
          <div className="price-input">
            <input
              type="text"
              value={priceRange[0]}
              onChange={(e) =>
                setPriceRange([+e.target.value, priceRange[1]])
              }
            />
            <input
              type="text"
              value={priceRange[1]}
              onChange={(e) =>
                setPriceRange([priceRange[0], +e.target.value])
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PriceRangeFilter;