import React, { useState } from 'react';
import ProductPagination from '../shop/ProductPagination';
import PaginatedGrid from '../common/PaginatedGrid';
import ProductCard from '../shop/ProductCard';

// 商品清單
const products = [
  { title: '早餐店1', price: 30, img: require('../../assets/images/featured/feature-1.jpg'), categories: ['Activity', 'Rewards'] },
  { title: '早餐店2', price: 30, img: require('../../assets/images/featured/feature-2.jpg'), categories: ['OnlinePay', 'Delivery'] },
  { title: '早餐店3', price: 30, img: require('../../assets/images/featured/feature-3.jpg'), categories: ['Open', 'Rewards'] },
  { title: '早餐店4', price: 30, img: require('../../assets/images/featured/feature-4.jpg'), categories: ['Rewards', 'Activity'] },
  { title: '早餐店5', price: 30, img: require('../../assets/images/featured/feature-5.jpg'), categories: ['Rewards', 'OnlinePay'] },
  { title: '早餐店6', price: 30, img: require('../../assets/images/featured/feature-6.jpg'), categories: ['Activity', 'Delivery'] },
  { title: '早餐店7', price: 30, img: require('../../assets/images/featured/feature-7.jpg'), categories: ['Rewards', 'Open'] },
  { title: '早餐店8', price: 30, img: require('../../assets/images/featured/feature-8.jpg'), categories: ['Delivery', 'OnlinePay'] },

  { title: '早餐店9', price: 30, img: require('../../assets/images/featured/feature-1.jpg'), categories: ['Activity', 'Rewards'] },
  { title: '早餐店10', price: 30, img: require('../../assets/images/featured/feature-2.jpg'), categories: ['OnlinePay', 'Delivery'] },
  { title: '早餐店11', price: 30, img: require('../../assets/images/featured/feature-3.jpg'), categories: ['Open', 'Rewards'] },
  { title: '早餐店12', price: 30, img: require('../../assets/images/featured/feature-4.jpg'), categories: ['Rewards', 'Activity'] },
  { title: '早餐店13', price: 30, img: require('../../assets/images/featured/feature-5.jpg'), categories: ['Rewards', 'OnlinePay'] },
  { title: '早餐店14', price: 30, img: require('../../assets/images/featured/feature-6.jpg'), categories: ['Activity', 'Delivery'] },
  { title: '早餐店15', price: 30, img: require('../../assets/images/featured/feature-7.jpg'), categories: ['Rewards', 'Open'] },
  { title: '早餐店16', price: 30, img: require('../../assets/images/featured/feature-8.jpg'), categories: ['Delivery', 'OnlinePay'] },

  { title: '早餐店17˙', price: 30, img: require('../../assets/images/featured/feature-1.jpg'), categories: ['Activity', 'Rewards'] },
  { title: '早餐店18', price: 30, img: require('../../assets/images/featured/feature-2.jpg'), categories: ['OnlinePay', 'Delivery'] },
  { title: '早餐店19', price: 30, img: require('../../assets/images/featured/feature-3.jpg'), categories: ['Open', 'Rewards'] },
  { title: '早餐店20', price: 30, img: require('../../assets/images/featured/feature-4.jpg'), categories: ['Rewards', 'Activity'] },
  { title: '早餐店21', price: 30, img: require('../../assets/images/featured/feature-5.jpg'), categories: ['Rewards', 'OnlinePay'] },
  { title: '早餐店22', price: 30, img: require('../../assets/images/featured/feature-6.jpg'), categories: ['Activity', 'Delivery'] },
  { title: '早餐店23', price: 30, img: require('../../assets/images/featured/feature-7.jpg'), categories: ['Rewards', 'Open'] },
  { title: '早餐店24', price: 30, img: require('../../assets/images/featured/feature-8.jpg'), categories: ['Delivery', 'OnlinePay'] },

  { title: '早餐店25', price: 30, img: require('../../assets/images/featured/feature-1.jpg'), categories: ['Activity', 'Rewards'] },
  { title: '早餐店26', price: 30, img: require('../../assets/images/featured/feature-2.jpg'), categories: ['OnlinePay', 'Delivery'] },
  { title: '早餐店27', price: 30, img: require('../../assets/images/featured/feature-3.jpg'), categories: ['Open', 'Rewards'] },
  { title: '早餐店28', price: 30, img: require('../../assets/images/featured/feature-4.jpg'), categories: ['Rewards', 'Activity'] },
  { title: '早餐店29', price: 30, img: require('../../assets/images/featured/feature-5.jpg'), categories: ['Rewards', 'OnlinePay'] },
  { title: '早餐店30', price: 30, img: require('../../assets/images/featured/feature-6.jpg'), categories: ['Activity', 'Delivery'] },
  { title: '早餐店31', price: 30, img: require('../../assets/images/featured/feature-7.jpg'), categories: ['Rewards', 'Open'] },
  { title: '早餐店32', price: 30, img: require('../../assets/images/featured/feature-8.jpg'), categories: ['Delivery', 'OnlinePay'] },

  { title: '早餐店33', price: 30, img: require('../../assets/images/featured/feature-1.jpg'), categories: ['Activity', 'Rewards'] },
  { title: '早餐店34', price: 30, img: require('../../assets/images/featured/feature-2.jpg'), categories: ['OnlinePay', 'Delivery'] },
  { title: '早餐店35', price: 30, img: require('../../assets/images/featured/feature-3.jpg'), categories: ['Open', 'Rewards'] },
  { title: '早餐店36', price: 30, img: require('../../assets/images/featured/feature-4.jpg'), categories: ['Rewards', 'Activity'] },
  { title: '早餐店37', price: 30, img: require('../../assets/images/featured/feature-5.jpg'), categories: ['Rewards', 'OnlinePay'] },
  { title: '早餐店38', price: 30, img: require('../../assets/images/featured/feature-6.jpg'), categories: ['Activity', 'Delivery'] },
  { title: '早餐店39', price: 30, img: require('../../assets/images/featured/feature-7.jpg'), categories: ['Rewards', 'Open'] },
  { title: '早餐店40', price: 30, img: require('../../assets/images/featured/feature-8.jpg'), categories: ['Delivery', 'OnlinePay'] },

  { title: '早餐店41', price: 30, img: require('../../assets/images/featured/feature-1.jpg'), categories: ['Activity', 'Rewards'] },
  { title: '早餐店42', price: 30, img: require('../../assets/images/featured/feature-2.jpg'), categories: ['OnlinePay', 'Delivery'] },
  { title: '早餐店43', price: 30, img: require('../../assets/images/featured/feature-3.jpg'), categories: ['Open', 'Rewards'] },
];

const categories = ['所有店家', '活動中', '點數回饋', '線上支付', '可外送', '營業中'];
const toClass = {
  '活動中': 'Activity',
  '點數回饋': 'Rewards',
  '線上支付': 'OnlinePay',
  '可外送': 'Delivery',
  '營業中': 'Open',
};

const PER_PAGE = 12;

const ShopList = () => {
  const [activeCategory, setActiveCategory] = useState('所有店家');
  const [currentPage, setCurrentPage] = useState(1);

  const filtered = activeCategory === '所有店家'
    ? products
    : products.filter(p => p.categories.includes(toClass[activeCategory]));

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
              <ProductCard data={item} />
            </div>
          ))}

          {/* 分頁控制 */}
          {/* <ProductPagination
            total={filtered.length}
            currentPage={currentPage}
            perPage={PER_PAGE}
            onPageChange={setCurrentPage}
          /> */}

        </div>

        {/* 分頁控制 */}
        <ProductPagination
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


// import React, { useState } from 'react';

// // 商品清單
// const products = [
//   { title: '早餐店1', price: 30, img: require('../../assets/images/featured/feature-1.jpg'), categories: ['Activity', 'Rewards'] },
//   { title: '早餐店2', price: 30, img: require('../../assets/images/featured/feature-2.jpg'), categories: ['OnlinePay', 'Delivery'] },
//   { title: '早餐店3', price: 30, img: require('../../assets/images/featured/feature-3.jpg'), categories: ['Open', 'Rewards'] },
//   { title: '早餐店4', price: 30, img: require('../../assets/images/featured/feature-4.jpg'), categories: ['Rewards', 'Activity'] },
//   { title: '早餐店5', price: 30, img: require('../../assets/images/featured/feature-5.jpg'), categories: ['Rewards', 'OnlinePay'] },
//   { title: '早餐店6', price: 30, img: require('../../assets/images/featured/feature-6.jpg'), categories: ['Activity', 'Delivery'] },
//   { title: '早餐店7', price: 30, img: require('../../assets/images/featured/feature-7.jpg'), categories: ['Rewards', 'Open'] },
//   { title: '早餐店8', price: 30, img: require('../../assets/images/featured/feature-8.jpg'), categories: ['Delivery', 'OnlinePay'] },

//   { title: '早餐店9', price: 30, img: require('../../assets/images/featured/feature-1.jpg'), categories: ['Activity', 'Rewards'] },
//   { title: '早餐店10', price: 30, img: require('../../assets/images/featured/feature-2.jpg'), categories: ['OnlinePay', 'Delivery'] },
//   { title: '早餐店11', price: 30, img: require('../../assets/images/featured/feature-3.jpg'), categories: ['Open', 'Rewards'] },
//   { title: '早餐店12', price: 30, img: require('../../assets/images/featured/feature-4.jpg'), categories: ['Rewards', 'Activity'] },
//   { title: '早餐店13', price: 30, img: require('../../assets/images/featured/feature-5.jpg'), categories: ['Rewards', 'OnlinePay'] },
//   { title: '早餐店14', price: 30, img: require('../../assets/images/featured/feature-6.jpg'), categories: ['Activity', 'Delivery'] },
//   { title: '早餐店15', price: 30, img: require('../../assets/images/featured/feature-7.jpg'), categories: ['Rewards', 'Open'] },
//   { title: '早餐店16', price: 30, img: require('../../assets/images/featured/feature-8.jpg'), categories: ['Delivery', 'OnlinePay'] },
// ];

// const categories = ['所有店家', '活動中', '點數回饋', '線上支付', '可外送', '營業中'];
// const toClass = {
//   '活動中': 'Activity',
//   '點數回饋': 'Rewards',
//   '線上支付': 'OnlinePay',
//   '可外送': 'Delivery',
//   '營業中': 'Open',
// };

// export default function ShopList() {
//   const [activeCategory, setActiveCategory] = useState('所有店家');

//   const filtered = activeCategory === '所有店家'
//     ? products
//     : products.filter(p => p.categories.includes(toClass[activeCategory]));

//   return (
//     <section className="featured spad">
//       <div className="container">
//         <div className="section-title">
//           <h2>推薦店家</h2>
//         </div>

//         <div className="featured__controls">
//           <ul>
//             {categories.map(c => (
//               <li
//                 key={c}
//                 className={c === activeCategory ? 'active' : ''}
//                 onClick={() => setActiveCategory(c)}
//               >
//                 {c}
//               </li>
//             ))}
//           </ul>
//         </div>

//         <div className="row featured__filter">
//           {filtered.map((p, index) => (
//             <div className="col-lg-3 col-md-4 col-sm-6" key={index}>
//               {/* 商品卡片 */}
//               <div className="featured__item">
//                 <div
//                   className="featured__item__pic"
//                   style={{
//                     backgroundImage: `url(${p.img})`,
//                     backgroundSize: 'cover',
//                     backgroundPosition: 'center',
//                   }}
//                 >
//                   <ul className="featured__item__pic__hover">
//                     <li><a href="#"><i className="fa fa-heart"></i></a></li>
//                     <li><a href="#"><i className="fa fa-retweet"></i></a></li>
//                     <li><a href="#"><i className="fa fa-shopping-cart"></i></a></li>
//                   </ul>
//                 </div>
//                 <div className="featured__item__text">
//                   <h6><a href="#">{p.title}</a></h6>
//                   <h5>${p.price.toFixed(2)}</h5>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// }

// 商品清單
// const products = [
//   { title: 'Crab Pool Security', price: 30, img: require('../../assets/images/featured/feature-1.jpg'), categories: ['Activity', 'Rewards'] },
//   { title: 'Crab Pool Security', price: 30, img: require('../../assets/images/featured/feature-2.jpg'), categories: ['OnlinePay', 'Delivery'] },
//   { title: 'Crab Pool Security', price: 30, img: require('../../assets/images/featured/feature-3.jpg'), categories: ['Open', 'Rewards'] },
//   { title: 'Crab Pool Security', price: 30, img: require('../../assets/images/featured/feature-4.jpg'), categories: ['Rewards', 'Activity'] },
//   { title: 'Crab Pool Security', price: 30, img: require('../../assets/images/featured/feature-5.jpg'), categories: ['Rewards', 'OnlinePay'] },
//   { title: 'Crab Pool Security', price: 30, img: require('../../assets/images/featured/feature-6.jpg'), categories: ['Activity', 'Delivery'] },
//   { title: 'Crab Pool Security', price: 30, img: require('../../assets/images/featured/feature-7.jpg'), categories: ['Rewards', 'Open'] },
//   { title: 'Crab Pool Security', price: 30, img: require('../../assets/images/featured/feature-8.jpg'), categories: ['Delivery', 'OnlinePay'] },
// ];

// // ShopList component is referred from FeaturedProducts.js 
// const ShopList = () => {
//   return (
//     <section className="featured spad">
//       <div className="container">

//         <div className="row">
//           <div className="col-lg-12">
//             <div className="section-title">
//               <h2>推薦店家</h2>
//             </div>
//             <div className="featured__controls">
//               <ul>
//                 <li className="active">所有店家</li>
//                 <li>活動中</li>
//                 <li>點數回饋</li>
//                 <li>線上支付</li>
//                 <li>可外送</li>
//                 <li>營業中</li>
//               </ul>
//             </div>
//           </div>
//         </div>

//         <div className="row featured__filter">
//           {products.map((p, index) => (
//             <div className="col-lg-3 col-md-4 col-sm-6" key={index}>
//               <div className="featured__item">
//                 <div
//                   className="featured__item__pic"
//                   style={{
//                     backgroundImage: `url(${p.img})`,
//                     backgroundSize: 'cover',
//                     backgroundPosition: 'center',
//                   }}
//                 >
//                   <ul className="featured__item__pic__hover">
//                     <li><a href="#"><i className="fa fa-heart"></i></a></li>
//                     <li><a href="#"><i className="fa fa-retweet"></i></a></li>
//                     <li><a href="#"><i className="fa fa-shopping-cart"></i></a></li>
//                   </ul>
//                 </div>
//                 <div className="featured__item__text">
//                   <h6><a href="#">{p.title}</a></h6>
//                   <h5>${p.price.toFixed(2)}</h5>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>

//       </div>
//     </section>
//   );
// };

// export default ShopList;