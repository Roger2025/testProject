// ogani: shop-grid.html - Pduct Section（第2-1～第2-2部分）
// src/components/home/PopularShopLoginSlider.js (已登入-單個滑動元件）

// 安裝 Swiper：npm install swiper
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import { Navigation, Autoplay } from 'swiper/modules';
import 'swiper/css/navigation';
import '../../styles/ProductDiscount.css'; // 放自訂樣式 可放 Ogani 原樣式
// import { parseCategoryField } from '../../utils/CategoryParser';
import { isStoreOpen } from '../../utils/timeUtils';
import { Link } from 'react-router-dom';

const getImageURL = (path) => `http://localhost:3001/images/${path}`;
const defaultImageURL = 'http://localhost:3001/images/ByteEat.png'; // 平台的 logo 路徑

const PopularShopLoginSlider = () => {
  const [popularshops, setProducts] = useState([]);
  const flagAll = true; // true: 所有 category 都列為 'all'; false: category = null or undefined 不列為 'all'.

  function parseCategoryJSON(categoryObj) {
  if (!categoryObj || typeof categoryObj !== 'object') return [];
  return Object.entries(categoryObj)
    .filter(([_, value]) => value === true)
    .map(([key]) => key);
  }

  // 取得資料
  useEffect(() => {
    axios.get('http://localhost:3001/api/home/shop/')
      .then(res => {
        const formatted = res.data.map(item => {
          // const parsedCategory = parseCategoryField(item.category);
          const rawCategory = item.category ?? {};
          const parsedCategory = parseCategoryJSON(rawCategory); // 將 JSON 轉成 [String]
          // ✅ 確認這裡是否為 ['delivery', 'pickup', 'cash_only', 'popular']
          console.log(`${item.storeName} 👉`, parsedCategory); 
          
          const business = Array.isArray(item.Business)
            ? item.Business.length > 0 ? item.Business[0] : null
            : item.Business || null;

          const schedule = business?.schedule ?? []; // 或其他預設值
          const timezone = business?.timezone ?? 'Asia/Taipei'; // 或其他預設值
          const status = isStoreOpen(schedule, timezone);
          const isOpenNow = status?.isOpen ?? false;
          // 加入 'open' 標籤（如果營業中且尚未包含）
          const finalCategory = parsedCategory.includes('open') || !isOpenNow
            ? parsedCategory
            : [...parsedCategory, 'open'];
          console.log(`${item.storeName} finalCategory 👉`, finalCategory); 

          // flagAll 控制是否將 category 為 null 的店家歸類為 'all'
          const shouldIncludeAll = flagAll && (item.category == null || Object.keys(item.category).length === 0);
          const finalWithAll = shouldIncludeAll
            ? [...finalCategory, 'all']
            : finalCategory;

          return {
            name: item.storeName,
            img: item.storeImag ? getImageURL(item.storeImag) : defaultImageURL,
            url: `/user/shop/${item.merchantId}`,  // 如果原本 URL 是 `/store4` 這樣拼比較直覺
            merchantId: item.merchantId,
            category: finalWithAll,
            // category: parseCategoryField(item.category), // 修改後 正確格式 category: ['All', 'Open', 'Popular']
            // category: item.category, // 錯誤格式 ategory: [ "['All', 'Open', 'Popular']" ] 
            isOpenNow, // ✅ 可傳給 ShopCard 顯示「營業中」徽章
          };
        });

      // 篩選出包含 'Popular' 的店家
      const popularOnly = formatted.filter(shop =>
        Array.isArray(shop.category) && shop.category.includes('popular')
      );

        setProducts(popularOnly);
      })
      .catch(err => {
        console.error('載入店家資料失敗:', err);
      });
  }, []);

  return (
    <div className="product__discount">
      <div className="section-title product__discount__title">
        <h2>熱門早餐店</h2>
      </div>
      <div className="row">
        <div className="product__discount__slider">
          <Swiper 
          modules={[Navigation, Autoplay]}
          spaceBetween={10} 
          slidesPerView={3}
          autoplay={{ delay: 3000, disableOnInteraction: false }}
          navigation
          breakpoints={{
            640: {
              slidesPerView: 1,
            },
            768: {
              slidesPerView: 2,
            },
            1024: {
              slidesPerView: 3,
            },
          }}
          >
            {popularshops.map((item, index) => {
              const imageURL = item.img; // item.img = 'discount01.jpg'        
              return (
              <SwiperSlide key={index}>
                <div className="product__item">
                  <Link to={item.url} style={{ textDecoration: 'none' , color: 'inherit' }}>
                    <div
                      className="product__item__pic set-bg"
                      style={{
                        backgroundImage: `url(${imageURL})`, // 獲取特定圖片的 URL  
                      }}
                    >
                      <ul className="product__item__pic__hover">
                        <li><a href="#"><i className="fa fa-heart"></i></a></li>
                        <li><a href="#"><i className="fa fa-retweet"></i></a></li>
                        <li><a href="#"><i className="fa fa-shopping-cart"></i></a></li>
                      </ul>
                    </div>
                    <div className="product__item__text">
                      <h6>{item.name}</h6>
                    </div>
                  </Link> 
                </div>
              </SwiperSlide>
              );
            })}
          </Swiper>
        </div>
      </div>
    </div>
  );
};

export default PopularShopLoginSlider;