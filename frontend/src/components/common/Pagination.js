// ogani: shop-grid.html - Pduct Section（第2-4～第2-15部分）
// src/components/common/Pagination.js (頁碼導覽)
// 頁碼導覽，組件改造，讓它支援：
// - 傳入總筆數 total
// - 傳入目前頁 currentPage
// - 傳入每頁顯示筆數 perPage
// - 傳入頁碼點擊事件 onPageChange

const Pagination = ({ total, currentPage, perPage, onPageChange }) => {
  const pageCount = Math.ceil(total / perPage);

  return (
    <div className="product__pagination">

      {currentPage > 1 && (
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            // onPageChange(currentPage + 1);  // 小瑕疵已發現：上一頁的邏輯使用 ，應改為 。
            onPageChange(currentPage - 1);  // ← 修正這行
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

export default Pagination;