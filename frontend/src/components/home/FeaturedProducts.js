import React, { useState } from 'react';
import ProductPagination from '../shop/ProductPagination';
import PaginatedGrid from '../common/PaginatedGrid';
import ProductCard from '../shop/ProductCard';

// 商品清單
const products = [
  { title: '早餐店', price: 30, img: require('../../assets/images/featured/feature-1.jpg'), categories: ['All', 'Toast', 'Serving'] },
  { title: '早餐店', price: 30, img: require('../../assets/images/featured/feature-2.jpg'), categories: ['All', 'Omelette', 'Serving'] },
  { title: '早餐店', price: 30, img: require('../../assets/images/featured/feature-3.jpg'), categories: ['All', 'SetMeal', 'Serving'] },
  { title: '早餐店', price: 30, img: require('../../assets/images/featured/feature-4.jpg'), categories: ['All', 'Waffle', 'Serving'] },
  { title: '早餐店', price: 30, img: require('../../assets/images/featured/feature-5.jpg'), categories: ['All', 'Noodle', 'Serving'] },
  { title: '早餐店', price: 30, img: require('../../assets/images/featured/feature-6.jpg'), categories: ['All', 'Hamburger', 'Serving'] },
  { title: '早餐店', price: 30, img: require('../../assets/images/featured/feature-7.jpg'), categories: ['All', 'Single', 'Serving'] },
  { title: '早餐店', price: 30, img: require('../../assets/images/featured/feature-8.jpg'), categories: ['All', 'Drinks', 'Serving'] },

  { title: '早餐店', price: 30, img: require('../../assets/images/featured/feature-1.jpg'), categories: ['All', 'Toast', 'Serving'] },
  { title: '早餐店', price: 30, img: require('../../assets/images/featured/feature-2.jpg'), categories: ['All', 'Omelette', 'Serving'] },
  { title: '早餐店', price: 30, img: require('../../assets/images/featured/feature-3.jpg'), categories: ['All', 'SetMeal', 'Serving'] },
  { title: '早餐店', price: 30, img: require('../../assets/images/featured/feature-4.jpg'), categories: ['All', 'Waffle', 'Serving'] },
  { title: '早餐店', price: 30, img: require('../../assets/images/featured/feature-5.jpg'), categories: ['All', 'Noodle', 'Serving'] },
  { title: '早餐店', price: 30, img: require('../../assets/images/featured/feature-6.jpg'), categories: ['All', 'Hamburger', 'Serving'] },
  { title: '早餐店', price: 30, img: require('../../assets/images/featured/feature-7.jpg'), categories: ['All', 'Single', 'Serving'] },
  { title: '早餐店', price: 30, img: require('../../assets/images/featured/feature-8.jpg'), categories: ['All', 'Drinks', 'Serving'] },
  
  { title: '早餐店', price: 30, img: require('../../assets/images/featured/feature-1.jpg'), categories: ['All', 'Toast', 'Discount'] },
  { title: '早餐店', price: 30, img: require('../../assets/images/featured/feature-2.jpg'), categories: ['All', 'Omelette', 'Discount'] },
  { title: '早餐店', price: 30, img: require('../../assets/images/featured/feature-3.jpg'), categories: ['All', 'SetMeal', 'Seasonal'] },
  { title: '早餐店', price: 30, img: require('../../assets/images/featured/feature-4.jpg'), categories: ['All', 'Waffle', 'Seasonal'] },
  { title: '早餐店', price: 30, img: require('../../assets/images/featured/feature-5.jpg'), categories: ['All', 'RNoodle', 'Discount'] },
  { title: '早餐店', price: 30, img: require('../../assets/images/featured/feature-6.jpg'), categories: ['All', 'Hamburger', 'Discount'] },
  { title: '早餐店', price: 30, img: require('../../assets/images/featured/feature-7.jpg'), categories: ['All', 'Single', 'Seasonal'] },
  { title: '早餐店', price: 30, img: require('../../assets/images/featured/feature-8.jpg'), categories: ['All', 'Drinks', 'Discount'] },

  { title: '早餐店', price: 30, img: require('../../assets/images/featured/feature-1.jpg'), categories: ['All', 'Toast', 'Serving'] },
  { title: '早餐店', price: 30, img: require('../../assets/images/featured/feature-2.jpg'), categories: ['All', 'Omelette', 'Serving'] },
  { title: '早餐店', price: 30, img: require('../../assets/images/featured/feature-3.jpg'), categories: ['All', 'SetMeal', 'Serving'] },
  { title: '早餐店', price: 30, img: require('../../assets/images/featured/feature-4.jpg'), categories: ['All', 'Waffle', 'Serving'] },
  { title: '早餐店', price: 30, img: require('../../assets/images/featured/feature-5.jpg'), categories: ['All', 'Noodle', 'Serving'] },
  { title: '早餐店', price: 30, img: require('../../assets/images/featured/feature-6.jpg'), categories: ['All', 'Hamburger', 'Serving'] },
  { title: '早餐店', price: 30, img: require('../../assets/images/featured/feature-7.jpg'), categories: ['All', 'Single', 'Serving'] },
  { title: '早餐店', price: 30, img: require('../../assets/images/featured/feature-8.jpg'), categories: ['All', 'Drinks', 'Serving'] },  

  { title: '早餐店', price: 30, img: require('../../assets/images/featured/feature-1.jpg'), categories: ['All', 'Toast', 'Discount'] },
  { title: '早餐店', price: 30, img: require('../../assets/images/featured/feature-2.jpg'), categories: ['All', 'Omelette', 'Discount'] },
  { title: '早餐店', price: 30, img: require('../../assets/images/featured/feature-3.jpg'), categories: ['All', 'SetMeal', 'Seasonal'] },
  { title: '早餐店', price: 30, img: require('../../assets/images/featured/feature-4.jpg'), categories: ['All', 'Waffle', 'Seasonal'] },
  { title: '早餐店', price: 30, img: require('../../assets/images/featured/feature-5.jpg'), categories: ['All', 'RNoodle', 'Discount'] },
  { title: '早餐店', price: 30, img: require('../../assets/images/featured/feature-6.jpg'), categories: ['All', 'Hamburger', 'Discount'] },
  { title: '早餐店', price: 30, img: require('../../assets/images/featured/feature-7.jpg'), categories: ['All', 'Single', 'Seasonal'] },
  { title: '早餐店', price: 30, img: require('../../assets/images/featured/feature-8.jpg'), categories: ['All', 'Drinks', 'Discount'] },

  { title: '早餐店', price: 30, img: require('../../assets/images/featured/feature-1.jpg'), categories: ['All', 'Toast', 'Serving'] },
  { title: '早餐店', price: 30, img: require('../../assets/images/featured/feature-2.jpg'), categories: ['All', 'Omelette', 'Serving'] },
  { title: '早餐店', price: 30, img: require('../../assets/images/featured/feature-3.jpg'), categories: ['All', 'SetMeal', 'Serving'] },
];

const categories = ['所有餐點', '漢堡', '吐司', '蛋餅', '鬆餅', '麵食', '套餐', '單品' ,'飲品','優惠中','季節性'];
const toClass = {
  '所有餐點': 'All',
  '漢堡': 'Hamburger',
  '吐司': 'Toast',
  '蛋餅': 'Omelette',
  '鬆餅': 'Waffle', 
  '麵食': 'Noodle',
  '套餐': 'SetMeal',  
  '單品': 'Single',
  '飲品': 'Drinks',
  '季節性': 'Seasonal',
  '優惠中': 'Discount',
  '供餐中': 'Serving',
  '售完': 'SoldOut',  
  '新餐點': 'New',
  '停賣': 'StopSelling',
};

const PER_PAGE = 12;

const FeaturedProducts = () => {
  const [activeCategory, setActiveCategory] = useState('所有餐點');
  const [currentPage, setCurrentPage] = useState(1);

  const filtered = activeCategory === '所有餐點'
    ? products
    : products.filter(p => p.categories.includes(toClass[activeCategory]));

  const paginated = filtered.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE);


  return (
    <section className="featured spad">
      <div className="container">
        <div className="section-title">
          <h2>推薦餐點</h2>
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
              <ProductCard data={item} />
            </div>
          ))}
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

export default FeaturedProducts;


// import React from 'react';

// // 商品清單
// const products = [
//   { title: 'Crab Pool Security', price: 30, img: require('../../assets/images/featured/feature-1.jpg'), categories: ['hamburger', 'toast'] },
//   { title: 'Crab Pool Security', price: 30, img: require('../../assets/images/featured/feature-2.jpg'), categories: ['omelette', 'drinks'] },
//   { title: 'Crab Pool Security', price: 30, img: require('../../assets/images/featured/feature-3.jpg'), categories: ['omelette', 'toast'] },
//   { title: 'Crab Pool Security', price: 30, img: require('../../assets/images/featured/feature-4.jpg'), categories: ['toast', 'hamburger'] },
//   { title: 'Crab Pool Security', price: 30, img: require('../../assets/images/featured/feature-5.jpg'), categories: ['toast', 'omelette'] },
//   { title: 'Crab Pool Security', price: 30, img: require('../../assets/images/featured/feature-6.jpg'), categories: ['hamburger', 'drinks'] },
//   { title: 'Crab Pool Security', price: 30, img: require('../../assets/images/featured/feature-7.jpg'), categories: ['toast', 'omelette'] },
//   { title: 'Crab Pool Security', price: 30, img: require('../../assets/images/featured/feature-8.jpg'), categories: ['drinks', 'omelette'] },
// ];

// const FeaturedProducts = () => {
//   return (
//     <section className="featured spad">
//       <div className="container">

//         <div className="row">
//           <div className="col-lg-12">
//             <div className="section-title">
//               <h2>Featured Product</h2>
//             </div>
//             <div className="featured__controls">
//               <ul>
//                 <li className="active">所有菜單</li>
//                 <li>漢堡</li>
//                 <li>吐司</li>
//                 <li>蛋餅</li>
//                 <li>鬆餅</li>
//                 <li>麵食</li>
//                 <li>套餐</li>
//                 <li>麵食</li>
//                 <li>飲品</li>
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

// export default FeaturedProducts;