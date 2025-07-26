// ogani : shop-grid.html :　Pduct Section（第2-4～第2-15部分）
// ProductPagination.js
// Path = components/shop/
// 頁碼導覽 使用於 ProductCard.js 

import React from 'react';

const ProductPagination = () => {
  return (
    <div className="product__pagination">
      <a href="#">1</a>
      <a href="#">2</a>
      <a href="#">3</a>
      <a href="#"><i className="fa fa-long-arrow-right"></i></a>
    </div>
  );
};

export default ProductPagination;