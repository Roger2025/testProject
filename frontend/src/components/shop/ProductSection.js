// ogani : shop-grid.html : Product Section　
// ProductSection.js
// Path = components/shop/

// import React from 'react';
import React, { useState } from 'react';

import ProductSidebar from './ProductSidebar';
import ProductDiscount from './ProductDiscount';
import ProductFilters from './ProductFilters'; 
import ProductCard from './ProductCard';
import ProductPagination from './ProductPagination';

// const dummyProducts = [/* 假商品陣列 */];

const ProductSection = ({ products }) => {
  // const [products, setProducts] = useState(dummyProducts);
  const [currentView, setCurrentView] = useState('grid');
  const handleSort = (sortType) => {
    // 排序邏輯，可根據 sortType 實作
  };

  return (
    <section className="product spad">
      <div className="container">
        <div className="row">
          {/* 左側 Sidebar */}
          <div className="col-lg-3 col-md-5">
            <ProductSidebar />
          </div>

          {/* 商品區 */}
          <div className="col-lg-9 col-md-7">
            <ProductDiscount />

            {/* <ProductFilters
              productCount={products.length}
              onSortChange={handleSort}
              viewType={currentView}
              onViewToggle={setCurrentView}
            />             */}

            {/* <div className="row">
              {Array.isArray(products) &&
                products
                  .filter(item => item && typeof item === 'object' && item.img)
                  .map((item) => (
                    <div className="col-lg-4 col-md-6 col-sm-6" key={item.id}>
                      <ProductCard data={item} />
                    </div>
                  ))}
            </div> */}
            <ProductPagination />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductSection;