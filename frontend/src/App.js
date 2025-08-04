// import logo from './logo.svg';
import './App.css';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.min.css';

// src/App.js
import React from 'react';
// import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Routes, Route, Navigate } from 'react-router-dom';

import HomeRoutes from './routes/HomeRoutes';

function App() {
  return (
    <div className='App'>
      <Routes>
        <Route path="/*" element={ <HomeRoutes /> } /> 
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default App;
