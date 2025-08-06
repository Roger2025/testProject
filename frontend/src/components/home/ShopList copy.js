// src/commponents/home/ShopList.js  (店家清單)

import React, { useState } from 'react';
import ShopCard from './ShopCard';
import Pagination from '../common/Pagination';
// import PaginatedGrid from '../common/PaginatedGrid';

// 透過後端 Node.js /public/images/ 下載圖片
// 必須先打開 Node.js 伺服器 localhost:3001/images/merchant1
export const getImageURL = (modulePath) => {
  return `http://localhost:3001/images/${modulePath}`;
};

// 早餐店圖案 1 ~ 10
const products = [
  // 現在想要放在 node.js 設定的 backend/public/images/
  // { name: '早餐店1', img: 'http://localhost:3001/images/merchant01.jpg', url: '/shoplogout', category: ['Open','OnlinePay','Rewards'] },
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
  
  { name: '早餐店11', img: getImageURL('merchant01.jpg'), url: '/shoplogin', category: ['Open','OnlinePay'] },
  { name: '早餐店12', img: getImageURL('merchant02.jpg'), url: '/shoplogin', category: ['Open','Rewards'] },
  { name: '早餐店13', img: getImageURL('merchant03.jpg'), url: '/shoplogin', category: ['Open','OnlinePay'] },
  { name: '早餐店14', img: getImageURL('merchant04.jpg'), url: '/shoplogin', category: ['Rest','OnlinePay'] },
  { name: '早餐店15', img: getImageURL('merchant05.jpg'), url: '/shoplogin', category: ['Open','OnlinePay','Activity'] },
  { name: '早餐店16', img: getImageURL('merchant06.jpg'), url: '/shoplogin', category: ['Open','OnlinePay'] },
  { name: '早餐店17', img: getImageURL('merchant07.jpg'), url: '/shoplogin', category: ['Rest','OnlinePay','Rewards'] },
  { name: '早餐店18', img: getImageURL('merchant08.jpg'), url: '/shoplogin', category: ['Rest','OnlinePay'] },
  { name: '早餐店19', img: getImageURL('merchant09.jpg'), url: '/shoplogin', category: ['Open','OnlinePay','Rewards'] },
  { name: '早餐店20', img: getImageURL('merchant10.jpg'), url: '/shoplogin', category: ['Open','OnlinePay','Delivery'] },

  { name: '早餐店21', img: getImageURL('merchant01.jpg'), url: '/shoplogin', category: ['Open','OnlinePay','Delivery'] },
  { name: '早餐店22', img: getImageURL('merchant02.jpg'), url: '/shoplogin', category: ['Open','OnlinePay'] },
  { name: '早餐店23', img: getImageURL('merchant03.jpg'), url: '/shoplogin', category: ['Open','OnlinePay','Rewards'] },
  { name: '早餐店24', img: getImageURL('merchant04.jpg'), url: '/shoplogin', category: ['Rest','OnlinePay'] },
  { name: '早餐店25', img: getImageURL('merchant05.jpg'), url: '/shoplogin', category: ['Open','OnlinePay'] },
  { name: '早餐店26', img: getImageURL('merchant06.jpg'), url: '/shoplogin', category: ['Open','OnlinePay'] },
  { name: '早餐店27', img: getImageURL('merchant07.jpg'), url: '/shoplogin', category: ['Open','Rewards'] },
  { name: '早餐店28', img: getImageURL('merchant08.jpg'), url: '/shoplogin', category: ['Rest','OnlinePay'] },
  { name: '早餐店29', img: getImageURL('merchant09.jpg'), url: '/shoplogin', category: ['Open','OnlinePay'] },
  { name: '早餐店30', img: getImageURL('merchant10.jpg'), url: '/shoplogin', category: ['Open','OnlinePay','Delivery'] },
  
  { name: '早餐店31', img: getImageURL('merchant01.jpg'), url: '/shoplogin', category: ['Open','OnlinePay','Rewards'] },
  { name: '早餐店32', img: getImageURL('merchant02.jpg'), url: '/shoplogin', category: ['Open','OnlinePay'] },
  { name: '早餐店33', img: getImageURL('merchant03.jpg'), url: '/shoplogin', category: ['Open','OnlinePay'] },
  { name: '早餐店34', img: getImageURL('merchant04.jpg'), url: '/shoplogin', category: ['Rest','OnlinePay'] },
  { name: '早餐店35', img: getImageURL('merchant05.jpg'), url: '/shoplogin', category: ['Open','OnlinePay'] },
  { name: '早餐店36', img: getImageURL('merchant06.jpg'), url: '/shoplogin', category: ['Open','Delivery','Activity'] },
  { name: '早餐店37', img: getImageURL('merchant07.jpg'), url: '/shoplogin', category: ['Rest','OnlinePay','Delivery'] },
  { name: '早餐店38', img: getImageURL('merchant08.jpg'), url: '/shoplogin', category: ['Rest','OnlinePay'] },
  { name: '早餐店39', img: getImageURL('merchant09.jpg'), url: '/shoplogin', category: ['Open','OnlinePay','Rewards'] },
  { name: '早餐店40', img: getImageURL('merchant10.jpg'), url: '/shoplogin', category: ['Open','OnlinePay','Delivery'] },  

// 原本圖片放在 react 設定的 frontend/src/assets/images/
//   { name: '早餐店1', img: require('../../assets/images/merchant01.jpg'), url: '/shoplogin', category: ['Open','OnlinePay','Rewards'] },
//   { name: '早餐店2', img: require('../../assets/images/merchant02.jpg'), url: '/shoplogin', category: ['Open','OnlinePay','Delivery'] },
//   { name: '早餐店3', img: require('../../assets/images/merchant03.jpg'), url: '/shoplogin', category: ['Open','OnlinePay'] },
//   { name: '早餐店4', img: require('../../assets/images/merchant04.jpg'), url: '/shoplogin', category: ['Rest','OnlinePay','Activity'] },
//   { name: '早餐店5', img: require('../../assets/images/merchant05.jpg'), url: '/shoplogin', category: ['Open','OnlinePay'] },
//   { name: '早餐店6', img: require('../../assets/images/merchant06.jpg'), url: '/shoplogin', category: ['Open','OnlinePay','Delivery'] },
//   { name: '早餐店7', img: require('../../assets/images/merchant07.jpg'), url: '/shoplogin', category: ['Open','OnlinePay','Rewards'] },
//   { name: '早餐店8', img: require('../../assets/images/merchant08.jpg'), url: '/shoplogin', category: ['Rest','OnlinePay'] },
//   { name: '早餐店9', img: require('../../assets/images/merchant09.jpg'), url: '/shoplogin', category: ['Open','OnlinePay'] },
//   { name: '早餐店10', img: require('../../assets/images/merchant10.jpg'), url: '/shoplogin', category: ['Open','OnlinePay'] },
  
//   { name: '早餐店11', img: require('../../assets/images/merchant01.jpg'), url: '/shoplogin', category: ['Open','OnlinePay'] },
//   { name: '早餐店12', img: require('../../assets/images/merchant02.jpg'), url: '/shoplogin', category: ['Open','Rewards'] },
//   { name: '早餐店13', img: require('../../assets/images/merchant03.jpg'), url: '/shoplogin', category: ['Open','OnlinePay'] },
//   { name: '早餐店14', img: require('../../assets/images/merchant04.jpg'), url: '/shoplogin', category: ['Rest','OnlinePay'] },
//   { name: '早餐店15', img: require('../../assets/images/merchant05.jpg'), url: '/shoplogin', category: ['Open','OnlinePay','Activity'] },
//   { name: '早餐店16', img: require('../../assets/images/merchant06.jpg'), url: '/shoplogin', category: ['Open','OnlinePay'] },
//   { name: '早餐店17', img: require('../../assets/images/merchant07.jpg'), url: '/shoplogin', category: ['Rest','OnlinePay','Rewards'] },
//   { name: '早餐店18', img: require('../../assets/images/merchant08.jpg'), url: '/shoplogin', category: ['Rest','OnlinePay'] },
//   { name: '早餐店19', img: require('../../assets/images/merchant09.jpg'), url: '/shoplogin', category: ['Open','OnlinePay','Rewards'] },
//   { name: '早餐店20', img: require('../../assets/images/merchant10.jpg'), url: '/shoplogin', category: ['Open','OnlinePay','Delivery'] },

//   { name: '早餐店21', img: require('../../assets/images/merchant01.jpg'), url: '/shoplogin', category: ['Open','OnlinePay','Delivery'] },
//   { name: '早餐店22', img: require('../../assets/images/merchant02.jpg'), url: '/shoplogin', category: ['Open','OnlinePay'] },
//   { name: '早餐店23', img: require('../../assets/images/merchant03.jpg'), url: '/shoplogin', category: ['Open','OnlinePay','Rewards'] },
//   { name: '早餐店24', img: require('../../assets/images/merchant04.jpg'), url: '/shoplogin', category: ['Rest','OnlinePay'] },
//   { name: '早餐店25', img: require('../../assets/images/merchant05.jpg'), url: '/shoplogin', category: ['Open','OnlinePay'] },
//   { name: '早餐店26', img: require('../../assets/images/merchant06.jpg'), url: '/shoplogin', category: ['Open','OnlinePay'] },
//   { name: '早餐店27', img: require('../../assets/images/merchant07.jpg'), url: '/shoplogin', category: ['Open','Rewards'] },
//   { name: '早餐店28', img: require('../../assets/images/merchant08.jpg'), url: '/shoplogin', category: ['Rest','OnlinePay'] },
//   { name: '早餐店29', img: require('../../assets/images/merchant09.jpg'), url: '/shoplogin', category: ['Open','OnlinePay'] },
//   { name: '早餐店30', img: require('../../assets/images/merchant10.jpg'), url: '/shoplogin', category: ['Open','OnlinePay','Delivery'] },
  
//   { name: '早餐店31', img: require('../../assets/images/merchant01.jpg'), url: '/shoplogin', category: ['Open','OnlinePay','Rewards'] },
//   { name: '早餐店32', img: require('../../assets/images/merchant02.jpg'), url: '/shoplogin', category: ['Open','OnlinePay'] },
//   { name: '早餐店33', img: require('../../assets/images/merchant03.jpg'), url: '/shoplogin', category: ['Open','OnlinePay'] },
//   { name: '早餐店34', img: require('../../assets/images/merchant04.jpg'), url: '/shoplogin', category: ['Rest','OnlinePay'] },
//   { name: '早餐店35', img: require('../../assets/images/merchant05.jpg'), url: '/shoplogin', category: ['Open','OnlinePay'] },
//   { name: '早餐店36', img: require('../../assets/images/merchant06.jpg'), url: '/shoplogin', category: ['Open','Delivery','Activity'] },
//   { name: '早餐店37', img: require('../../assets/images/merchant07.jpg'), url: '/shoplogin', category: ['Rest','OnlinePay','Delivery'] },
//   { name: '早餐店38', img: require('../../assets/images/merchant08.jpg'), url: '/shoplogin', category: ['Rest','OnlinePay'] },
//   { name: '早餐店39', img: require('../../assets/images/merchant09.jpg'), url: '/shoplogin', category: ['Open','OnlinePay','Rewards'] },
//   { name: '早餐店40', img: require('../../assets/images/merchant10.jpg'), url: '/shoplogin', category: ['Open','OnlinePay','Delivery'] },
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
          {/* 分頁控制 使用 PaginatedGrid (有問題) 組件來渲染商品卡片 */}
          {/* <PaginatedGrid
            items={filtered}
            renderItem={(item, index) => (
            // 使用 ProductCard 組件渲染商品卡片
            <div className="col-lg-3 col-md-4 col-sm-6" key={index}>
              <ProductCard data={item} />
            </div>
            )} 
            perPage={PER_PAGE}
            className="row"
            // 這裡可以直接使用 paginated 來渲染商品卡片
            // 這樣可以避免重複渲染，並且保持結構
          />   */}

          {/* 商品卡片 */}
          { paginated.map((item, index) => (
            <div className="col-lg-3 col-md-4 col-sm-6" key={index}>
              <ShopCard data={item} />
            </div>
          ))}

          {/* 分頁控制 */}
          {/* <Pagination
            total={filtered.length}
            currentPage={currentPage}
            perPage={PER_PAGE}
            onPageChange={setCurrentPage}
          /> */}

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