## 智慧早餐點餐平台

一個前後端分離的智慧早餐點餐平台系統，由 React 搭配 Express 架構組成。

## 專案結構

project-JS-B/
├── frontend/ # React 應用程式 (port: 3000)
├── backend/ # Express API 伺服器 (port: 3001)
├── .gitignore
├── README.md

## 使用方式
前端啟動
cd frontend
npm install
npm start

後端啟動
cd backend
npm install
npm run dev

## 環境變數設定
請依照專案目錄中的 `.env.example` 建立環境變數設定檔：

### 前端
cp frontend/.env.example frontend/.env

### 後端
cp backend/.env.example backend/.env

請根據實際需求填寫對應變數，例如：

backend/.env
PORT=3001
NODE_ENV=development
VERSION=1.0.0

frontend/.env
設定 API 伺服器位址，例如：
REACT_APP_API_URL=http://localhost:3001

注意：.env 檔已被加入 .gitignore，不應提交至 Git。

## 使用技術
前端：React
後端：Node.js / express
Database：MongoDB / Firebase
網路架設平台：Heroku / Azure
版本控管：Git / GitHub

## 開發者(JS 全端工程師 B 組)
成員 (學號、姓名)
101409492 華致齊
104552258 柯世為
105806942 許志朋
105888248 許昌源
105943048 楊書瑋