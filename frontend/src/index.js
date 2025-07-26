import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'; // 你自己的全站樣式
import App from './App';
import { Provider } from 'react-redux';
import store from './store/store'; 
import { BrowserRouter } from 'react-router-dom';
import reportWebVitals from './reportWebVitals';

// 樣式
// import 'bootstrap/dist/css/bootstrap.min.css'; // Bootstrap 4 核心樣式
import './styles/css/bootstrap.min.css'; 
import './styles/css/style.css';               // Ogani 自訂樣式
import './styles/css/font-awesome.min.css';    // Font Awesome 圖示
import './styles/css/elegant-icons.css';       // Elegant Icons
import './styles/css/owl.carousel.min.css';    // Owl Carousel 樣式
import './styles/css/slicknav.min.css';        // SlickNav 樣式
// 可加入 Google Fonts 於 public/index.html 裡的 <head>

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
