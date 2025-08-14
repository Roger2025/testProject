// src/pages/merchant/ProfilePage.jsx
import React from 'react';
import StoreProfile from '../../features/merchant/storeStatus/ProfileEdit';


const ProfilePage = () => {
  return (
    <div className="container-fluid py-4">
      <div className="row">
        <div className="col-12">
          <h2 className="mb-4">店家基本資料</h2>
        </div>
      </div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div className="row">
          {/* 營業狀態區塊 */}
          <div className="col-12 mb-4">
            <StoreProfile />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;