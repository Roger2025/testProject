// ogani : shop-grid.html :　Pduct Section（第2-4～第2-15部分）
// ProductPagination.js
// Path = components/shop/
// 頁碼導覽 使用於 ProductCard.js 
// 組件改造，讓它支援：
// - 傳入總筆數 total
// - 傳入目前頁 currentPage
// - 傳入每頁顯示筆數 perPage
// - 傳入頁碼點擊事件 onPageChange

import React from 'react';

const ProductPagination = ({ total, currentPage, perPage, onPageChange }) => {
  const pageCount = Math.ceil(total / perPage);

  return (
    <div className="product__pagination">

      {currentPage > 1 && (
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            onPageChange(currentPage + 1);
          }}
        >
          <i className="fa fa-long-arrow-left"></i>
        </a>
      )}

      {Array.from({ length: pageCount }, (_, i) => (
        <a
          href="#"
          key={i}
          className={i + 1 === currentPage ? 'active' : ''}
          onClick={(e) => {
            e.preventDefault();
            onPageChange(i + 1);
          }}
        >
          {i + 1}
        </a>
      ))}

      {currentPage < pageCount && (
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            onPageChange(currentPage + 1);
          }}
        >
          <i className="fa fa-long-arrow-right"></i>
        </a>
      )}

    </div>
  );
};

export default ProductPagination;

// Original code snippet
// import React from 'react';

// const ProductPagination = () => {
//   return (
//     <div className="product__pagination">
//       <a href="#">1</a>
//       <a href="#">2</a>
//       <a href="#">3</a>
//       <a href="#"><i className="fa fa-long-arrow-right"></i></a>
//     </div>
//   );
// };

// export default ProductPagination;