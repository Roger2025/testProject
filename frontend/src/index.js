// src/index.js －－ 直接整份覆蓋
import React from 'react';
import ReactDOM from 'react-dom/client';

// 全域樣式：放在這裡（不要放到 public/index.html）
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/style.css';         // 你的 ogani 套版/全域樣式
import './styles/index.css';         // 你的自訂全域樣式
// 若你想用「本地版」Font Awesome，取消下一行註解（同時請移除 index.html 的 CDN 連結）
// import 'font-awesome/css/font-awesome.min.css';

// App 與其他 providers
import App from './App';
import { Provider } from 'react-redux';
import store from './store/index';
import reportWebVitals from './reportWebVitals';
import { UserProvider } from './contexts/UserData';
import { OrderProvider } from './api/OrderContext';
import { BrowserRouter } from 'react-router-dom';
import { bindGetState } from './services/merchantApi';

// 綁定 getState
bindGetState(() => store.getState());

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <UserProvider>
        <OrderProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </OrderProvider>
      </UserProvider>
    </Provider>
  </React.StrictMode>
);

reportWebVitals();
