// ogani : shop-grid.html :　Pduct Section（第2-4～第2-15部分）
// ProductList.js
// Path = components/shop/
// 主容器：渲染所有商品（主列表渲染）使用於 ProductCard.js

import React from 'react';
import ProductCard from './ProductCard';
import ProductPagination from './ProductPagination';

const mockProducts = Array.from({ length: 12 }, (_, i) => ({
  id: i + 1,
  name: 'Crab Pool Security',
  price: 30,
  img: `/assets/ogani/img/product/product-${i + 1}.jpg`,
}));

const ProductList = () => {
  return (
    <>
      <div className="row">
        {mockProducts.map((product) => (
          <div className="col-lg-4 col-md-6 col-sm-6" key={product.id}>
            <ProductCard product={product} />
          </div>
        ))}
      </div>
      <ProductPagination />
    </>
  );
};

export default ProductList;