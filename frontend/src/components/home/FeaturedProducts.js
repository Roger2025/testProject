import React, { useState } from 'react';
import ProductPagination from '../shop/ProductPagination';
import PaginatedGrid from '../common/PaginatedGrid';
import ProductCard from '../shop/ProductCard';

// 透過後端 Node.js /public/images/ 下載圖片
// 必須先打開 Node.js 伺服器 localhost:3001/images/merchant1
export const getImageURL = (modulePath) => {
  return `http://localhost:3001/images/merchant1/${modulePath}`;
};

// 商品清單 : 早餐的餐點圖案
const products = [

  // { title: '蛋堡', price: 35, img: 'http://localhost:3001/images/merchant1/burgers/burgers01.jpg', url: '/merchant1/burgers/', categories: ['burgers', 'Serving'] },
  { title: '蛋堡', price: 35, img: getImageURL('burgers/burgers01.jpg'), url: '/burgers/', categories: ['burgers', 'Serving'] },
  { title: '玉米蛋堡', price: 55, img: getImageURL('burgers/burgers02.jpg'), url: '/burgers/', categories: ['burgers', 'Serving'] },
  { title: '吉士蔬菜堡', price: 45, img: getImageURL('burgers/burgers03.jpg'), url: '/burgers/', categories: ['burgers', 'Serving'] },
  { title: '薯餅堡', price: 45, img: getImageURL('burgers/burgers04.jpg'), url: '/burgers/', categories: ['burgers', 'Serving'] },
  { title: '培根堡', price: 50, img: getImageURL('burgers/burgers05.jpg'), url: '/burgers/', categories: ['burgers', 'Serving'] },
  { title: '鮪魚堡', price: 50, img: getImageURL('burgers/burgers06.jpg'), url: '/burgers/', categories: ['burgers', 'Serving'] },
  { title: '麥香雞堡', price: 40, img: getImageURL('burgers/burgers07.jpg'), url: '/burgers/', categories: ['burgers', 'Serving'] },
  { title: '燻雞堡', price: 55, img: getImageURL('burgers/burgers08.jpg'), url: '/burgers/', categories: ['burgers', 'Serving'] },
  { title: '嫩雞堡', price: 55, img: getImageURL('burgers/burgers09.jpg'), url: '/burgers/', categories: ['burgers', 'Serving'] },
  { title: '卡滋雞腿堡', price: 55, img: getImageURL('burgers/burgers10.jpg'), url: '/burgers/', categories: ['burgers', 'Serving'] },
  { title: '照燒豬肉堡', price: 55, img: getImageURL('burgers/burgers11.jpg'), url: '/burgers/', categories: ['burgers', 'Serving'] },
  { title: '牛肉起司堡', price: 55, img: getImageURL('burgers/burgers12.jpg'), url: '/burgers/', categories: ['burgers', 'Serving'] },

  { title: '煎蛋吐司', price: 30, img: getImageURL('toast/toast01.jpg'), url: '/toast/', categories: ['toast', 'Serving'] },
  { title: '玉米蛋吐司', price: 50, img: getImageURL('toast/toast02.jpg'), url: '/toast/', categories: ['toast', 'Serving'] },
  { title: '吉士蔬菜吐司', price: 35, img: getImageURL('toast/toast03.jpg'), url: '/toast/', categories: ['toast', 'Serving'] },
  { title: '培根吐司', price: 45, img: getImageURL('toast/toast04.jpg'), url: '/toast/', categories: ['toast', 'Serving'] },
  { title: '鮪魚堡吐司', price: 45, img: getImageURL('toast/toast05.jpg'), url: '/toast/', categories: ['toast', 'Serving'] },
  { title: '麥香雞吐司', price: 35, img: getImageURL('toast/toast06.jpg'), url: '/toast/', categories: ['toast', 'Serving'] },
  { title: '燻雞吐司', price: 50, img: getImageURL('toast/toast07.jpg'), url: '/toast/', categories: ['toast', 'Serving'] },
  { title: '嫩雞吐司', price: 50, img: getImageURL('toast/toast08.jpg'), url: '/toast/', categories: ['toast', 'Serving'] },
  { title: '卡滋雞腿吐司', price: 50, img: getImageURL('toast/toast09.jpg'), url: '/toast/', categories: ['toast', 'Serving'] },
  { title: '照燒豬肉吐司', price: 45, img: getImageURL('toast/toast10.jpg'), url: '/toast/', categories: ['toast', 'Serving'] },
  { title: '牛肉起司吐司', price: 50, img: getImageURL('toast/toast11.jpg'), url: '/toast/', categories: ['toast', 'Serving'] },
  { title: '花生吐司', price: 20, img: getImageURL('toast/toast12.jpg'), url: '/toast/', categories: ['toast', 'Serving'] },
  { title: '巧克力吐司', price: 20, img: getImageURL('toast/toast13.jpg'), url: '/toast/', categories: ['toast', 'Serving'] },
  { title: '草莓吐司', price: 20, img: getImageURL('toast/toast14.jpg'), url: '/toast/', categories: ['toast', 'Serving'] },
  { title: '奶酥吐司', price: 20, img: getImageURL('toast/toast15.jpg'), url: '/toast/', categories: ['toast', 'Serving'] },

  { title: '蛋餅', price: 30, img: getImageURL('omelettes/omelettes01.jpg'), url: '/omelettes/', categories: ['omelettes', 'Serving'] },
  { title: '吉士蔬菜蛋餅', price: 50, img: getImageURL('omelettes/omelettes02.jpg'), url: '/omelettes/', categories: ['omelettes', 'Serving'] },
  { title: '薯餅蛋餅', price: 50, img: getImageURL('omelettes/omelettes03.jpg'), url: '/omelettes/', categories: ['omelettes', 'Serving'] },
  { title: '培根蛋餅', price: 55, img: getImageURL('omelettes/omelettes04.jpg'), url: '/omelettes/', categories: ['omelettes', 'Serving'] },
  { title: '鮪魚堡蛋餅', price: 55, img: getImageURL('omelettes/omelettes05.jpg'), url: '/omelettes/', categories: ['omelettes', 'Serving'] },
  { title: '燻雞蛋餅', price: 60, img: getImageURL('omelettes/omelettes06.jpg'), url: '/omelettes/', categories: ['omelettes', 'Serving'] },
  { title: '照燒豬肉蛋餅', price: 55, img: getImageURL('omelettes/omelettes07.jpg'), url: '/omelettes/', categories: ['omelettes', 'Serving'] },

  { title: '磨菇麵', price: 50, img: getImageURL('pasta/pasta01.jpg'), url: '/pasta/', categories: ['pasta', 'Serving'] },
  { title: '黑胡椒麵', price: 50, img: getImageURL('pasta/pasta02.jpg'), url: '/pasta/', categories: ['pasta', 'Serving'] },

  { title: '荷包蛋', price: 15, img: getImageURL('single/single01.jpg'), url: '/single/', categories: ['single', 'Serving'] },
  { title: '薯餅', price: 20, img: getImageURL('single/single02.jpg'), url: '/single/', categories: ['single', 'Serving'] },
  { title: '蘿蔔糕', price: 35, img: getImageURL('single/single03.jpg'), url: '/single/', categories: ['single', 'Serving'] },
  { title: '熱狗', price: 20, img: getImageURL('single/single04.jpg'), url: '/single/', categories: ['single', 'Serving'] },
  { title: '雞塊', price: 40, img: getImageURL('single/single05.jpg'), url: '/single/', categories: ['single', 'Serving'] },

  { title: '紅茶', price: 20, img: getImageURL('drinks/drinks01.jpg'), url: '/drinks/', categories: ['drinks', 'Serving'] },
  { title: '奶茶', price: 25, img: getImageURL('drinks/drinks02.jpg'), url: '/drinks/', categories: ['drinks', 'Serving'] },
  { title: '鮮奶茶', price: 30, img: getImageURL('drinks/drinks03.jpg'), url: '/drinks/', categories: ['drinks', 'Serving'] },
  { title: '豆漿', price: 20, img: getImageURL('drinks/drinks04.jpg'), url: '/drinks/', categories: ['drinks', 'Serving'] },
  { title: '咖啡', price: 45, img: getImageURL('drinks/drinks05.jpg'), url: '/drinks/', categories: ['drinks', 'Serving'] },
  { title: '柳橙汁', price: 25, img: getImageURL('drinks/drinks06.jpg'), url: '/drinks/', categories: ['drinks', 'Serving'] },

  { title: '鮮蛋沙拉', price: 50, img: getImageURL('salad/salad01.jpg'), url: '/salad/', categories: ['salad', 'Serving'] },
  { title: '地瓜沙拉', price: 50, img: getImageURL('salad/salad02.jpg'), url: '/salad/', categories: ['salad', 'Serving'] },
  { title: '燻雞沙拉', price: 75, img: getImageURL('salad/salad03.jpg'), url: '/salad/', categories: ['salad', 'Serving'] },
  { title: '嫩雞沙拉', price: 85, img: getImageURL('salad/salad04.jpg'), url: '/salad/', categories: ['salad', 'Serving'] },

  // 原本圖片放在 react 設定的 frontend/src/assets/images/
  // { title: '蛋堡', price: 35, img: require('../../assets/images/merchant1/burgers/burgers01.jpg'), url: '/merchant1/burgers/', categories: ['burgers', 'Serving'] },
  // { title: '玉米蛋堡', price: 55, img: require('../../assets/images/merchant1/burgers/burgers02.jpg'), url: '/merchant1/burgers/', categories: ['burgers', 'Serving'] },
  // { title: '吉士蔬菜堡', price: 45, img: require('../../assets/images/merchant1/burgers/burgers03.jpg'), url: '/merchant1/burgers/', categories: ['burgers', 'Serving'] },
  // { title: '薯餅堡', price: 45, img: require('../../assets/images/merchant1/burgers/burgers04.jpg'), url: '/merchant1/burgers/', categories: ['burgers', 'Serving'] },
  // { title: '培根堡', price: 50, img: require('../../assets/images/merchant1/burgers/burgers05.jpg'), url: '/merchant1/burgers/', categories: ['burgers', 'Serving'] },
  // { title: '鮪魚堡', price: 50, img: require('../../assets/images/merchant1/burgers/burgers06.jpg'), url: '/merchant1/burgers/', categories: ['burgers', 'Serving'] },
  // { title: '麥香雞堡', price: 40, img: require('../../assets/images/merchant1/burgers/burgers07.jpg'), url: '/merchant1/burgers/', categories: ['burgers', 'Serving'] },
  // { title: '燻雞堡', price: 55, img: require('../../assets/images/merchant1/burgers/burgers08.jpg'), url: '/merchant1/burgers/', categories: ['burgers', 'Serving'] },
  // { title: '嫩雞堡', price: 55, img: require('../../assets/images/merchant1/burgers/burgers09.jpg'), url: '/merchant1/burgers/', categories: ['burgers', 'Serving'] },
  // { title: '卡滋雞腿堡', price: 55, img: require('../../assets/images/merchant1/burgers/burgers10.jpg'), url: '/merchant1/burgers/', categories: ['burgers', 'Serving'] },
  // { title: '照燒豬肉堡', price: 55, img: require('../../assets/images/merchant1/burgers/burgers11.jpg'), url: '/merchant1/burgers/', categories: ['burgers', 'Serving'] },
  // { title: '牛肉起司堡', price: 55, img: require('../../assets/images/merchant1/burgers/burgers12.jpg'), url: '/merchant1/burgers/', categories: ['burgers', 'Serving'] },

  // { title: '煎蛋吐司', price: 30, img: require('../../assets/images/merchant1/toast/toast01.jpg'), url: '/merchant1/toast/', categories: ['toast', 'Serving'] },
  // { title: '玉米蛋吐司', price: 50, img: require('../../assets/images/merchant1/toast/toast02.jpg'), url: '/merchant1/toast/', categories: ['toast', 'Serving'] },
  // { title: '吉士蔬菜吐司', price: 35, img: require('../../assets/images/merchant1/toast/toast03.jpg'), url: '/merchant1/toast/', categories: ['toast', 'Serving'] },
  // { title: '培根吐司', price: 45, img: require('../../assets/images/merchant1/toast/toast04.jpg'), url: '/merchant1/toast/', categories: ['toast', 'Serving'] },
  // { title: '鮪魚堡吐司', price: 45, img: require('../../assets/images/merchant1/toast/toast05.jpg'), url: '/merchant1/toast/', categories: ['toast', 'Serving'] },
  // { title: '麥香雞吐司', price: 35, img: require('../../assets/images/merchant1/toast/toast06.jpg'), url: '/merchant1/toast/', categories: ['toast', 'Serving'] },
  // { title: '燻雞吐司', price: 50, img: require('../../assets/images/merchant1/toast/toast07.jpg'), url: '/merchant1/toast/', categories: ['toast', 'Serving'] },
  // { title: '嫩雞吐司', price: 50, img: require('../../assets/images/merchant1/toast/toast08.jpg'), url: '/merchant1/toast/', categories: ['toast', 'Serving'] },
  // { title: '卡滋雞腿吐司', price: 50, img: require('../../assets/images/merchant1/toast/toast09.jpg'), url: '/merchant1/toast/', categories: ['toast', 'Serving'] },
  // { title: '照燒豬肉吐司', price: 45, img: require('../../assets/images/merchant1/toast/toast10.jpg'), url: '/merchant1/toast/', categories: ['toast', 'Serving'] },
  // { title: '牛肉起司吐司', price: 50, img: require('../../assets/images/merchant1/toast/toast11.jpg'), url: '/merchant1/toast/', categories: ['toast', 'Serving'] },
  // { title: '花生吐司', price: 20, img: require('../../assets/images/merchant1/toast/toast12.jpg'), url: '/merchant1/toast/', categories: ['toast', 'Serving'] },
  // { title: '巧克力吐司', price: 20, img: require('../../assets/images/merchant1/toast/toast13.jpg'), url: '/merchant1/toast/', categories: ['toast', 'Serving'] },
  // { title: '草莓吐司', price: 20, img: require('../../assets/images/merchant1/toast/toast14.jpg'), url: '/merchant1/toast/', categories: ['toast', 'Serving'] },
  // { title: '奶酥吐司', price: 20, img: require('../../assets/images/merchant1/toast/toast15.jpg'), url: '/merchant1/toast/', categories: ['toast', 'Serving'] },

  // { title: '蛋餅', price: 30, img: require('../../assets/images/merchant1/omelettes/omelettes01.jpg'), url: '/merchant1/omelettes/', categories: ['omelettes', 'Serving'] },
  // { title: '吉士蔬菜蛋餅', price: 50, img: require('../../assets/images/merchant1/omelettes/omelettes02.jpg'), url: '/merchant1/omelettes/', categories: ['omelettes', 'Serving'] },
  // { title: '薯餅蛋餅', price: 50, img: require('../../assets/images/merchant1/omelettes/omelettes03.jpg'), url: '/merchant1/omelettes/', categories: ['omelettes', 'Serving'] },
  // { title: '培根蛋餅', price: 55, img: require('../../assets/images/merchant1/omelettes/omelettes04.jpg'), url: '/merchant1/omelettes/', categories: ['omelettes', 'Serving'] },
  // { title: '鮪魚堡蛋餅', price: 55, img: require('../../assets/images/merchant1/omelettes/omelettes05.jpg'), url: '/merchant1/omelettes/', categories: ['omelettes', 'Serving'] },
  // { title: '燻雞蛋餅', price: 60, img: require('../../assets/images/merchant1/omelettes/omelettes06.jpg'), url: '/merchant1/omelettes/', categories: ['omelettes', 'Serving'] },
  // { title: '照燒豬肉蛋餅', price: 55, img: require('../../assets/images/merchant1/omelettes/omelettes07.jpg'), url: '/merchant1/omelettes/', categories: ['omelettes', 'Serving'] },

  // { title: '磨菇麵', price: 50, img: require('../../assets/images/merchant1/pasta/pasta01.jpg'), url: '/merchant1/pasta/', categories: ['pasta', 'Serving'] },
  // { title: '黑胡椒麵', price: 50, img: require('../../assets/images/merchant1/pasta/pasta02.jpg'), url: '/merchant1/pasta/', categories: ['pasta', 'Serving'] },

  // { title: '荷包蛋', price: 15, img: require('../../assets/images/merchant1/single/single01.jpg'), url: '/merchant1/single/', categories: ['single', 'Serving'] },
  // { title: '薯餅', price: 20, img: require('../../assets/images/merchant1/single/single02.jpg'), url: '/merchant1/single/', categories: ['single', 'Serving'] },
  // { title: '蘿蔔糕', price: 35, img: require('../../assets/images/merchant1/single/single03.jpg'), url: '/merchant1/single/', categories: ['single', 'Serving'] },
  // { title: '熱狗', price: 20, img: require('../../assets/images/merchant1/single/single04.jpg'), url: '/merchant1/single/', categories: ['single', 'Serving'] },
  // { title: '雞塊', price: 40, img: require('../../assets/images/merchant1/single/single05.jpg'), url: '/merchant1/single/', categories: ['single', 'Serving'] },

  // { title: '紅茶', price: 20, img: require('../../assets/images/merchant1/drinks/drinks01.jpg'), url: '/merchant1/drinks/', categories: ['drinks', 'Serving'] },
  // { title: '奶茶', price: 25, img: require('../../assets/images/merchant1/drinks/drinks02.jpg'), url: '/merchant1/drinks/', categories: ['drinks', 'Serving'] },
  // { title: '鮮奶茶', price: 30, img: require('../../assets/images/merchant1/drinks/drinks03.jpg'), url: '/merchant1/drinks/', categories: ['drinks', 'Serving'] },
  // { title: '豆漿', price: 20, img: require('../../assets/images/merchant1/drinks/drinks04.jpg'), url: '/merchant1/drinks/', categories: ['drinks', 'Serving'] },
  // { title: '咖啡', price: 45, img: require('../../assets/images/merchant1/drinks/drinks05.jpg'), url: '/merchant1/drinks/', categories: ['drinks', 'Serving'] },
  // { title: '柳橙汁', price: 25, img: require('../../assets/images/merchant1/drinks/drinks06.jpg'), url: '/merchant1/drinks/', categories: ['drinks', 'Serving'] },

  // { title: '鮮蛋沙拉', price: 50, img: require('../../assets/images/merchant1/salad/salad01.jpg'), url: '/merchant1/salad/', categories: ['salad', 'Serving'] },
  // { title: '地瓜沙拉', price: 50, img: require('../../assets/images/merchant1/salad/salad02.jpg'), url: '/merchant1/salad/', categories: ['salad', 'Serving'] },
  // { title: '燻雞沙拉', price: 75, img: require('../../assets/images/merchant1/salad/salad03.jpg'), url: '/merchant1/salad/', categories: ['salad', 'Serving'] },
  // { title: '嫩雞沙拉', price: 85, img: require('../../assets/images/merchant1/salad/salad04.jpg'), url: '/merchant1/salad/', categories: ['salad', 'Serving'] },
];

const categories = ['所有餐點', '漢堡', '吐司', '蛋餅', '鬆餅', '麵食', '套餐', '單品' ,'飲品','優惠中','季節性'];
const toClass = {
  '漢堡': 'burgers',
  '吐司': 'toast',
  '蛋餅': 'omelettes',
  '鬆餅': 'muffins', 
  '麵食': 'pasta',
  '套餐': 'set_meal',  
  '單品': 'single',
  '飲品': 'drinks',
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
//   { title: 'Crab Pool Security', price: 30, img: require('../../assets/images/featured/feature-1.jpg'), categories: ['Burger', 'toast'] },
//   { title: 'Crab Pool Security', price: 30, img: require('../../assets/images/featured/feature-2.jpg'), categories: ['omelette', 'drinks'] },
//   { title: 'Crab Pool Security', price: 30, img: require('../../assets/images/featured/feature-3.jpg'), categories: ['omelette', 'toast'] },
//   { title: 'Crab Pool Security', price: 30, img: require('../../assets/images/featured/feature-4.jpg'), categories: ['toast', 'Burger'] },
//   { title: 'Crab Pool Security', price: 30, img: require('../../assets/images/featured/feature-5.jpg'), categories: ['toast', 'omelette'] },
//   { title: 'Crab Pool Security', price: 30, img: require('../../assets/images/featured/feature-6.jpg'), categories: ['Burger', 'drinks'] },
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