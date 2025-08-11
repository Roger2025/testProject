// src/components/home/PopularShop.js (熱門早餐店的自動瀏覽)

import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
// import { parseCategoryField } from '../../utils/CategoryParser';
import { isStoreOpen } from '../../utils/timeUtils';
import PopularShopSlider from './PopularShopSlider';

const getImageURL = (path) => `http://localhost:3001/images/${path}`;
const defaultImageURL = 'http://localhost:3001/images/ByteEat.png'; // 平台的 logo 路徑

const sliderSettings = {
  dots: false,
  infinite: true,
  speed: 500,
  slidesToShow: 4, // 每次顯示 4 組
  slidesToScroll: 1,
  autoplay: true,
  autoplaySpeed: 2000, // 自動播放間隔
  arrows: false, // 由 CarouselNav 控制 // 自訂箭頭不使用 slick 內建的
};

const PopularShop = () => {
  const sliderRef = useRef(null); // TODO: 控制滑動方向
  const [products, setProducts] = useState([]);
  const flagAll = true; // true: 所有 category 都列為 'all'; false: category = null or undefined 不列為 'all'.

  function parseCategoryJSON(categoryObj) {
  if (!categoryObj || typeof categoryObj !== 'object') return [];
  return Object.entries(categoryObj)
    .filter(([_, value]) => value === true)
    .map(([key]) => key);
  }

  // 取得資料並更新 products
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
            // category: parseCategoryField(item.category), // 修改後 正確格式 category: ['Open', 'OnlinePay']
            // category: item.category, // 錯誤格式 ategory: [ "['All', 'Open', 'Popular']" ] 
            isOpenNow, // ✅ 可傳給 ShopCard 顯示「營業中」徽章
          };
        });

      // 🔍 篩選出包含 'Popular' 的店家
      const popularOnly = formatted.filter(shop =>
        Array.isArray(shop.category) && shop.category.includes('popular')
      );

        setProducts(popularOnly);
      })
      .catch(err => {
        console.error('載入店家資料失敗:', err);
      });
  }, []);

  // 等 products 更新後執行 slickNext()
  useEffect(() => {
    if (sliderRef.current && products.length > 0) {
      sliderRef.current.slickNext();
    }
  }, [products]);

  return (
    <section className="categories">
      <div className="container">
          <PopularShopSlider shops={products} sliderSettings={sliderSettings} />
      </div>
    </section>
  );
};

export default PopularShop;