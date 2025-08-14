import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/index.css';
//import './index.css';
import App from './App';
import { Provider } from 'react-redux';
import  store  from './store/index';
// import { store } from './redux/store';
import reportWebVitals from './reportWebVitals';
import { UserProvider } from "./contexts/UserData"; // 0813 Wayne 需要 for User Login OK
import { OrderProvider } from "./api/OrderContext"; // 0813 Wayne 需要 for User Login OK
import 'bootstrap/dist/css/bootstrap.min.css'; // 引入 Bootstrap 樣式
import './styles/style.css'; // 引入ogani套版樣式(尚未全部引入)
import { BrowserRouter } from 'react-router-dom';
import { bindGetState } from './services/merchantApi';

bindGetState(() => store.getState()); // 綁定 getState 函數到 merchantApi

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

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
