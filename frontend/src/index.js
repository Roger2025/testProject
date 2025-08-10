import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/index.css';
import App from './App';
import { Provider } from 'react-redux';
import store from './store';
import reportWebVitals from './reportWebVitals';
import 'bootstrap/dist/css/bootstrap.min.css'; // 引入 Bootstrap 樣式
import './styles/style.css'; // 引入ogani套版樣式(尚未全部引入)
import { BrowserRouter } from 'react-router-dom';
import { bindGetState } from './services/merchantApi';

bindGetState(() => store.getState()); // 綁定 getState 函數到 merchantApi

// 第三方 UI 套件
import 'bootstrap/dist/css/bootstrap.min.css'; // Bootstrap 4 核心樣式
import 'font-awesome/css/font-awesome.min.css';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

// Ogani 主題樣式（自訂）
// import './styles/css/bootstrap.min.css'; 
import './styles/css/style.css';               // Ogani 自訂樣式
// import './styles/css/font-awesome.min.css';    // Font Awesome 圖示
import './styles/css/elegant-icons.css';       // Elegant Icons
import './styles/css/owl.carousel.min.css';    // Owl Carousel 樣式
import './styles/css/slicknav.min.css';        // SlickNav 樣式

// 自己的全站樣式（放最後以便覆蓋）
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
