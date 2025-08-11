// src/commponents/home/ShopList.js  (店家清單)

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useShopData } from '../../hooks/useShopData';
import { useNavigate } from 'react-router-dom';
import { parseCategoryField } from '../../utils/CategoryParser';
import { isStoreOpen } from '../../utils/timeUtils';
import ShopCard from './ShopCard';
import Pagination from '../common/Pagination';

// const categories = ['所有店家', '營業中', '可外送', '現金支付', '可外帶', '熱門店家', '線上支付', '活動中', '點數回饋'];
const categories = ['所有店家', '營業中', '可外送', '現金支付', '可外帶', '熱門店家'];
const toClass = {
  '所有店家': 'all',
  '營業中': 'open',
  '可外送': 'delivery', 
  '現金支付': 'cash_only',
  '可外帶': 'pickup', 
  '熱門店家': 'popular',  
  // '線上支付': 'online_pay',  
  // '活動中': 'activity',
  // '點數回饋': 'point_reward',
  // '可預約': 'booking',
  // '休息中': 'rest',
  // '停業中': 'closed',  
};

const PER_PAGE = 8; // 修改成一頁 4 行 x 2 列 = 8 個店家

const getImageURL = (path) => `http://localhost:3001/images/${path}`;
const defaultImageURL = 'http://localhost:3001/images/ByteEat.png';

const ShopList = ({ products: externalProducts }) => {
  // const [fetchedProducts, setFetchedProducts] = useState([]);
  const { shops, loading, error, empty } = useShopData();
  const [processedShops, setProcessedShops] = useState([]);
  const [activeCategory, setActiveCategory] = useState('所有店家');
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    // axios.get('http://localhost:3001/api/home/shop/')
    //   .then(res => {
    //     const formatted = res.data.map(item => {
        const formatted = shops.map(item => {  
          const parsedCategory = parseCategoryField(item.category);
          const business = Array.isArray(item.Business)
            ? item.Business.length > 0 ? item.Business[0] : null
            : item.Business || null;

          const schedule = business?.schedule ?? []; 
          const timezone = business?.timezone ?? 'Asia/Taipei'; 
          const status = isStoreOpen(schedule, timezone);
          const isOpenNow = status?.isOpen ?? false;

          const finalCategory = parsedCategory.includes('open') || !isOpenNow
            ? parsedCategory
            : [...parsedCategory, 'open'];

          return {
            name: item.storeName,
            img: item.storeImag ? getImageURL(item.storeImag) : defaultImageURL,
            url: `/shop/${item.merchantId}`, 
            merchantId: item.merchantId,
            category: finalCategory,
            isOpenNow, 
          };
        });
        // setFetchedProducts(formatted);
        setProcessedShops(formatted);
      }, [shops]);  
  //     })
  //     .catch(err => {
  //       console.error('載入店家資料失敗:', err);
  //     });
  // }, []);

  // const sourceProducts = externalProducts?.length > 0 ? externalProducts : fetchedProducts;

  const filtered = activeCategory === '所有店家'
    ? processedShops.filter(p => Array.isArray(p.category) && p.category.length > 0)
    : processedShops.filter(p =>
        Array.isArray(p.category) &&
        p.category.includes(toClass[activeCategory])
      );

  const paginated = filtered.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE);

  const handleClick = (merchantId) => {
    navigate(`/shop/${merchantId}`);
  };

  if (loading) return <div>載入中...</div>;
  if (error) return <div>發生錯誤：{error.message}</div>;
  if (empty) return <div>目前沒有店家資料</div>;
    
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