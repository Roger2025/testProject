// src/pages/merchant/StoreStatusPage.jsx
import React from 'react';
import ScheduleEdit from '../../features/merchant/storeStatus/ScheduleEdit';
// import StoreProfile from '../../features/merchant/storeStatus/ProfileEdit';

const StoreStatusPage = () => {
  return (
    <div className="container-fluid py-4">
      <div className="row">
        <div className="col-12">
          <h2 className="mb-4">營業時間管理</h2>
        </div>
      </div>
      
      <div className="row">
        {/* 店家資料區塊 */}
        {/* <div className="col-12 mb-4">
          <StoreProfile />
        </div> */}

        {/* 營業排程設定區塊 */}
        <div className="col-12">
          <ScheduleEdit />
        </div>
      </div>
    </div>
  );
};

export default StoreStatusPage;