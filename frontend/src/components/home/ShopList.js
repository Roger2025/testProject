// src/commponents/home/ShopList.js  (店家清單)

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import ShopCard from './ShopCard';
import Pagination from '../common/Pagination';

const categories = ['所有店家', '活動中', '點數回饋', '線上支付', '可外送', '營業中'];
const toClass = {
  '活動中': 'Activity',
  '點數回饋': 'Rewards',
  '線上支付': 'OnlinePay',
  '可外送': 'Delivery',
  '營業中': 'Open',
  '可預約': 'Booking',
  '休息中': 'Rest',
  '停業中': 'Closed',
};

const PER_PAGE = 8; // 修改成一頁 4 行 x 2 列 = 8 個店家

const getImageURL = (path) => `http://localhost:3001/images/${path}`;

// 檢查並轉換字串型的陣列
const parseCategoryField = (rawCategory) => {
  try {
    if (Array.isArray(rawCategory)) {
      // 如果陣列第一個元素是字串且看起來像陣列
      const first = rawCategory[0];
      if (typeof first === 'string' && first.match(/\[\s*['"]/)) {
        // 移除多餘逗號並處理引號 → 嘗試解析
        const cleaned = first
          .replace(/,\s*\]/, ']')   // 尾端逗號清除
          .replace(/'/g, '"');      // 換成雙引號
        const parsed = JSON.parse(cleaned);
        return Array.isArray(parsed) ? parsed : [];
      }
      return rawCategory; // 已是合法陣列
    }

    if (typeof rawCategory === 'string' && rawCategory.startsWith('[')) {
      const cleaned = rawCategory
        .replace(/,\s*\]/, ']')
        .replace(/'/g, '"');
      const parsed = JSON.parse(cleaned);
      return Array.isArray(parsed) ? parsed : [];
    }

    return []; // 無法解析
  } catch (err) {
    console.warn('分類解析失敗:', rawCategory);
    return [];
  }
};

const ShopList = () => {
  const [products, setProducts] = useState([]);
  const [activeCategory, setActiveCategory] = useState('所有店家');
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();

  // 🔄 取得資料
  useEffect(() => {
    axios.get('http://localhost:3001/api/shops/')
      .then(res => {
        const formatted = res.data.map(item => {
          const parsedCategory = parseCategoryField(item.category);
          console.log(`${item.storeName} 👉`, parsedCategory); // ✅ 確認這裡是否為 ['Open', 'OnlinePay']
          
          return {
            name: item.storeName,
            img: getImageURL(item.storeImag),
            url: `/shop/${item.merchantId}`,  // 如果原本 URL 是 `/store4` 這樣拼比較直覺
            category: parsedCategory,
            // category: parseCategoryField(item.category), // 修改後 正確格式 category: ['Open', 'OnlinePay']
            // category: item.category, // 錯誤格式 ategory: [ "['Open', 'OnlinePay']" ] 
          };
        });
        
        setProducts(formatted);
      })
      .catch(err => {
        console.error('載入店家資料失敗:', err);
      });
  }, []);

  // 🧠 過濾分類
  const filtered = activeCategory === '所有店家'
    ? products
    : products.filter(p => p.category.includes(toClass[activeCategory]));

  const paginated = filtered.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE);

  const handleClick = (merchantId) => {
    navigate(`/store/${merchantId}`);
  };

  return (
    <section className="featured spad">
      <div className="container">
        <div className="section-title"><h2>推薦店家</h2></div>

        {/* 分類篩選 */}
        <div className="featured__controls">
          <ul>
            {categories.map(c => (
              <li
                key={c}
                className={c === activeCategory ? 'active' : ''}
                onClick={() => {
                  setActiveCategory(c);
                  setCurrentPage(1);
                }}
              >
                {c}
              </li>
            ))}
          </ul>
        </div>

        {/* 商品清單 */}
        <div className="row featured__filter">
          {paginated.map((item, index) => (
            <div className="col-lg-3 col-md-4 col-sm-6" key={item.merchantId} onClick={() => handleClick(item.merchantId)}>
              <ShopCard data={item} />
            </div>
          ))}
        </div>

        {/* 分頁 */}
        <Pagination
          total={filtered.length}
          currentPage={currentPage}
          perPage={PER_PAGE}
          onPageChange={setCurrentPage}
        />
      </div>
    </section>
  );
};

export default ShopList;