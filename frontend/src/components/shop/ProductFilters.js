// ogani : shop-grid.html :　Pduct Section（第2-3部分）	
// ProductFilters.js
// Path = components/shop/
// 篩選選單 使用於 ProductSection.js

import React from 'react';
// import './ProductFilters.css'; // 可放 Ogani 樣式或自訂

const ProductFilters = ({ productCount = 0, onSortChange, viewType, onViewToggle }) => {
  return (
    <div className="filter__item">
      <div className="row">
        {/* Sort By */}
        <div className="col-lg-4 col-md-5">
          <div className="filter__sort">
            <span>Sort By</span>
            <select onChange={(e) => onSortChange(e.target.value)}>
              <option value="default">Default</option>
              <option value="priceAsc">Price (Low to High)</option>
              <option value="priceDesc">Price (High to Low)</option>
              <option value="name">Name</option>
            </select>
          </div>
        </div>

        {/* Product Count */}
        <div className="col-lg-4 col-md-4">
          <div className="filter__found">
            <h6><span>{productCount}</span> Products found</h6>
          </div>
        </div>

        {/* View Toggle */}
        <div className="col-lg-4 col-md-3">
          <div className="filter__option">
            <span
              className={`icon_grid-2x2 ${viewType === 'grid' ? 'active' : ''}`}
              onClick={() => onViewToggle('grid')}
            ></span>
            <span
              className={`icon_ul ${viewType === 'list' ? 'active' : ''}`}
              onClick={() => onViewToggle('list')}
            ></span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductFilters;