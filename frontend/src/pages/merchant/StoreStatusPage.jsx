// src/pages/merchant/StoreStatusPage.jsx
import React from 'react';
// import StoreStatus from '../../features/merchant/storeStatus/StoreStatus';
import ScheduleEdit from '../../features/merchant/storeStatus/ScheduleEdit';
// const FEATURE_ENABLE_SET_MENU = false; // 開發期間關閉，正式時設 true


const StoreStatusPage = () => {
  return (
    <div className="container-fluid py-4">
      <div className="row">
        <div className="col-12">
          <h2 className="mb-4">店家設定管理</h2>
        </div>
      </div>
      
      <div className="row">
        {/* 營業狀態區塊 */}
        {/* <div className="col-12 mb-4">
          <StoreStatus />
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