// src/components/common/PaginatedGrid.js (頁碼導覽)
// 有些 React 元件不適用 

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

const PaginatedGrid = ({ items, renderItem, perPage = 12, breakpoints = {}, className = '' }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const pageFromQuery = parseInt(searchParams.get('page') || '1', 10);
  const [currentPage, setCurrentPage] = useState(pageFromQuery);

  const pageCount = Math.ceil(items.length / perPage);
  const paginatedItems = items.slice((currentPage - 1) * perPage, currentPage * perPage);

  useEffect(() => {
    setSearchParams({ page: currentPage });
  }, [currentPage]);

  return (
    <div className={className}>
      <div className="row">
        {paginatedItems.map((item, index) => renderItem(item, index))}
      </div>

      <div className="product__pagination">
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            if (currentPage > 1) setCurrentPage(currentPage - 1);
          }}
          className={currentPage === 1 ? 'disabled' : ''}
        >
          <i className="fa fa-long-arrow-left"></i>
        </a>

        {Array.from({ length: pageCount }, (_, i) => (
          <a
            href="#"
            key={i}
            className={i + 1 === currentPage ? 'active' : ''}
            onClick={(e) => {
              e.preventDefault();
              setCurrentPage(i + 1);
            }}
          >
            {i + 1}
          </a>
        ))}

        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            if (currentPage < pageCount) setCurrentPage(currentPage + 1);
          }}
          className={currentPage === pageCount ? 'disabled' : ''}
        >
          <i className="fa fa-long-arrow-right"></i>
        </a>
      </div>
    </div>
  );
};

export default PaginatedGrid;