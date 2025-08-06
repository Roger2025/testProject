// src/commponents/home/ShopList.js  (店家清單)

import React, { useState } from 'react';
import ShopCard from './ShopCard';
import Pagination from '../common/Pagination';

export const getImageURL = (modulePath) => {
  return `http://localhost:3001/images/${modulePath}`;
};

// 早餐店圖案 1 ~ 10
const products = [
  { name: '早餐店1', img: getImageURL('merchant01.jpg'), url: '/shoplogout', category: ['Open','OnlinePay','Rewards'] },
  { name: '早餐店2', img: getImageURL('merchant02.jpg'), url: '/shoplogin', category: ['Open','OnlinePay','Delivery'] },
  { name: '早餐店3', img: getImageURL('merchant03.jpg'), url: '/shoplogin', category: ['Open','OnlinePay'] },
  { name: '早餐店4', img: getImageURL('merchant04.jpg'), url: '/shoplogin', category: ['Rest','OnlinePay','Activity'] },
  { name: '早餐店5', img: getImageURL('merchant05.jpg'), url: '/shoplogin', category: ['Open','OnlinePay'] },
  { name: '早餐店6', img: getImageURL('merchant06.jpg'), url: '/shoplogin', category: ['Open','OnlinePay','Delivery'] },
  { name: '早餐店7', img: getImageURL('merchant07.jpg'), url: '/shoplogin', category: ['Open','OnlinePay','Rewards'] },
  { name: '早餐店8', img: getImageURL('merchant08.jpg'), url: '/shoplogin', category: ['Rest','OnlinePay'] },
  { name: '早餐店9', img: getImageURL('merchant09.jpg'), url: '/shoplogin', category: ['Open','OnlinePay'] },
  { name: '早餐店10', img: getImageURL('merchant10.jpg'), url: '/shoplogin', category: ['Open','OnlinePay'] },
];

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

const PER_PAGE = 12;

const ShopList = () => {
  const [activeCategory, setActiveCategory] = useState('所有店家');
  const [currentPage, setCurrentPage] = useState(1);

  const filtered = activeCategory === '所有店家'
    ? products
    : products.filter(p => p.category.includes(toClass[activeCategory]));

  const paginated = filtered.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE);

  return (
    <section className="featured spad">
      <div className="container">
        <div className="section-title">
          <h2>推薦店家</h2>
        </div>
        {/* 控制分類 */}
        <div className="featured__controls">
          <ul>
            {categories.map(c => (
              <li
                key={c}
                className={c === activeCategory ? 'active' : ''}
                onClick={() => {
                    setActiveCategory(c);
                    setCurrentPage(1); // 切換分類時重設頁碼
                }}
              >
                {c}
              </li>
            ))}
          </ul>
        </div>   
        {/* 商品清單 */}
        <div className="row featured__filter">
          {/* 商品卡片 */}
          { paginated.map((item, index) => (
            <div className="col-lg-3 col-md-4 col-sm-6" key={index}>
              <ShopCard data={item} />
            </div>
          ))}
         </div>
        {/* 分頁控制 */}
        <Pagination
          total={filtered.length}
          currentPage={currentPage}
          perPage={PER_PAGE}
          onPageChange={setCurrentPage}
        />
      </div>
    </section>
  );
}

export default ShopList;