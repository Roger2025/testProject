# 智慧早餐點餐平台 

一個前後端分離的智慧早餐點餐系統，由 **React + Node.js (Express)** 架構完成，搭配 **MongoDB** 資料庫與 **Azure/Heroku** 部署。  

---

## 專案功能
### 使用者端
- 註冊 / 登入 / 登出  
- 瀏覽餐點菜單  
- 新增訂單、查看訂單狀態  

### 商家端
- 新增、編輯、刪除餐點  
- 接收與管理顧客訂單  

### 管理員端
- 審核商家註冊  
- 管理使用者角色（user / shop / admin）  
- 權限控管  

---

##  使用技術
- **前端**：React、Axios、React Router  
- **後端**：Node.js、Express、Mongoose  
- **資料庫**：MongoDB  
- **其他**：Firebase、Heroku、Azure  
- **版本控制**：Git / GitHub  

---

##  系統截圖
[管理者停權/恢復/審核/儀錶板 介面]<img width="2879" height="1799" alt="image" src="https://github.com/user-attachments/assets/1ad568d0-24a1-4e35-bc10-bdeafa0f2e78" />
[管理者介面]<img width="2588" height="1144" alt="image" src="https://github.com/user-attachments/assets/b20fbfee-2450-4650-8702-09670daa9d3e" />
[email驗證畫面]<img width="818" height="698" alt="image" src="https://github.com/user-attachments/assets/caf53fd7-e1bd-4fe7-8c02-9b81c14fbe6d" />
[註冊畫面]<img width="827" height="1445" alt="image" src="https://github.com/user-attachments/assets/b5bdcf71-03b5-4320-8320-69564ab0e888" />
[註冊畫面]<img width="836" height="834" alt="image" src="https://github.com/user-attachments/assets/030d516c-8a64-4425-b3f6-e2c76a8f1910" />






> 範例：  
> ![登入頁面](images/login.png)  
> ![後台管理頁面](images/admin.png)  

---

##  環境變數
請依照 `.env.example` 建立 `.env` 檔案，設定前後端的 API 位置與參數。  

前端範例：
REACT_APP_API_URL=http://localhost:3001
後端範例：
PORT=3001
NODE_ENV=development
VERSION=1.0.0


---

##  我的開發貢獻
- **會員系統**：註冊 / 登入 / 登出流程、Session 驗證  
- **角色與權限管理**：實作 `admin / shop / user` 角色登入、路由權限控管  
- **管理者功能**：商家審核、帳號狀態管理（啟用/停權）  
- **安全性**：使用 `express-session`、bcrypt、驗證碼機制  

---



## 開發者(JS 全端工程師 B 組)
成員 (學號、姓名)
101409492 華致齊
104552258 柯世為
105806942 許志朋
105888248 許昌源
105943048 楊書瑋
