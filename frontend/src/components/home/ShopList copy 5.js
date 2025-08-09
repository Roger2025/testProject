// src/commponents/home/ShopList.js  (店家清單)

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { parseCategoryField } from '../../utils/CategoryParser';
import { isStoreOpen } from '../../utils/timeUtils';
import ShopCard from './ShopCard';
import Pagination from '../common/Pagination';

// const categories = ['所有店家', '活動中', '點數回饋', '線上支付', '可外送', '營業中'];
const categories = ['所有店家', '營業中', '熱門店家'];
const toClass = {
  '所有店家': 'All',
  '營業中': 'Open',
  '熱門店家': 'Popular',
  // '活動中': 'Activity',
  // '點數回饋': 'Rewards',
  // '線上支付': 'OnlinePay',
  // '可外送': 'Delivery',
  // '可預約': 'Booking',
  // '休息中': 'Rest',
  // '停業中': 'Closed',
};

const PER_PAGE = 8; // 修改成一頁 4 行 x 2 列 = 8 個店家

const getImageURL = (path) => `http://localhost:3001/images/${path}`;
const defaultImageURL = 'http://localhost:3001/images/ByteEat.png'; // 平台的 logo 路徑

const ShopList = ({ products: externalProducts }) => {
  // const [products, setProducts] = useState([]);
  const [fetchedProducts, setFetchedProducts] = useState([]);
  const [activeCategory, setActiveCategory] = useState('所有店家');
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();

  // 🔄 取得資料 （只在初次載入）
  useEffect(() => {
    axios.get('http://localhost:3001/api/home/shop/')
      .then(res => {
        const formatted = res.data.map(item => {
          const parsedCategory = parseCategoryField(item.category);
          console.log(`${item.storeName} 👉`, parsedCategory); // ✅ 確認這裡是否為 ['All', 'Open', 'Popular']
          
          // const business = item.Business; // 這是物件，不是陣列
          // const business = Array.isArray(item.Business) ? item.Business[0] : item.Business;

          const business = Array.isArray(item.Business)
            ? item.Business.length > 0 ? item.Business[0] : null
            : item.Business || null;

          const schedule = business?.schedule ?? []; // 或其他預設值
          const timezone = business?.timezone ?? 'Asia/Taipei'; // 或其他預設值

          // console.log(`${item.storeName} business 👉`, business); 
          // console.log(`${item.storeName} schedule 👉`, business.schedule); 
          // console.log(`${item.storeName} timezone 👉`, business.timezone); 

          // const status = isStoreOpen(business.schedule, business.timezone);
          const status = isStoreOpen(schedule, timezone);

          // console.log(`${item.storeName} 營業狀態 👉`, status);

          // const isOpenNow = business.schedule.isOpen;
          // console.log(`${item.storeName} status 👉`, status.isOpen); 

          const isOpenNow = status.isOpen

          // 如果尚未包含 'Open'，且目前營業 → 加入分類
          const finalCategory = parsedCategory.includes('Open') || !isOpenNow
            ? parsedCategory
            : [...parsedCategory, 'Open'];

          console.log(`${item.storeName} finalCategory 👉`, finalCategory); 
          // 🏷️ 根據營業狀態更新分類
          // const finalCategory = parsedCategory.includes('Open')
          //   ? parsedCategory
          //   : isOpenNow
          //     ? [...parsedCategory, 'Open']
          //     : parsedCategory;
             
          return {
            name: item.storeName,
            img: item.storeImag ? getImageURL(item.storeImag) : defaultImageURL,
            url: `/shop/${item.merchantId}`,  // 如果原本 URL 是 `/store4` 這樣拼比較直覺
            merchantId: item.merchantId,
            category: finalCategory,
            // category: parseCategoryField(item.category), // 修改後 正確格式 category: ['All', 'Open', 'Popular']
            // category: item.category, // 錯誤格式 ategory: [ "['All', 'Open', 'Popular']" ] 
            isOpenNow, // ✅ 可傳給 ShopCard 顯示「營業中」徽章
          };
        });
        
        // setProducts(formatted);
        setFetchedProducts(formatted);
      })
      .catch(err => {
        console.error('載入店家資料失敗:', err);
      });
  }, []);

  // 🧠 過濾分類
  // const filtered = activeCategory === '所有店家'
  //   ? products
  //   : products.filter(p => p.category.includes(toClass[activeCategory]));
 
  // 🧠 決定要用哪個資料來源
  const sourceProducts = externalProducts?.length > 0 ? externalProducts : fetchedProducts;


  const filtered = activeCategory === '所有店家'
    ? sourceProducts.filter(p => Array.isArray(p.category) && p.category.length > 0)
    : sourceProducts.filter(p =>
        Array.isArray(p.category) &&
        p.category.includes(toClass[activeCategory])
      );

  const paginated = filtered.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE);

  const handleClick = (merchantId) => {
    navigate(`/store/${merchantId}`);
  };

  return (
    <section className="featured spad">
      <div className="container">
        <div className="section-title"><h2>店家清單</h2></div>

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