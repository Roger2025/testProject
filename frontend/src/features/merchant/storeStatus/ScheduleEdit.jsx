//src/features/merchant/storeStatus/ScheduleEdit.jsx
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchMerchantSchedule,
  updateMerchantSchedule,
  updateDaySchedule,
  setBulkSchedule,
  clearError,
  resetSchedule
} from './merchantScheduleSlice';
// import { useMerchantId } from '../../../hooks/useMerchantId'; //整合測試及實際上線用
import { getEffectiveMerchantId } from '../../../utils/getMerchantId'; //開發階段接mock資料用

const ScheduleEdit = () => {
  const dispatch = useDispatch();
  const { schedule, loading, error, updateLoading } = useSelector(state => state.merchantSchedule);
//   const [merchantId, setMerchantId] = useState(null);
  const [bulkSettings, setBulkSettings] = useState({
    selectedDays: [],
    openTime: '05:00',
    closeTime: '14:00'
  });

  // 星期對應
  const dayLabels = {
    monday: '星期一',
    tuesday: '星期二', 
    wednesday: '星期三',
    thursday: '星期四',
    friday: '星期五',
    saturday: '星期六',
    sunday: '星期日'
  };
  //開發階段接mock資料用
  const rawMerchantId = localStorage.getItem('merchantId');
  const merchantId = getEffectiveMerchantId(rawMerchantId);

  //整合測試及實際上線用
  // const merchantId = useMerchantId();

  const dayKeys = Object.keys(dayLabels);

  useEffect(() => {
    const id = merchantId;
    if (id) {
      dispatch(fetchMerchantSchedule(id));
    }
  }, [dispatch, merchantId]);

  // 處理單日營業狀態切換
  const handleDayToggle = (day) => {
    dispatch(updateDaySchedule({
      day,
      scheduleData: { isOpen: !schedule[day].isOpen }
    }));
  };

  // 處理單日時間修改
  const handleTimeChange = (day, timeType, value) => {
    dispatch(updateDaySchedule({
      day,
      scheduleData: { [timeType]: value }
    }));
  };

  // 處理批量設定
  const handleBulkApply = () => {
    if (bulkSettings.selectedDays.length === 0) {
      alert('請選擇要設定的星期');
      return;
    }

    dispatch(setBulkSchedule({
      days: bulkSettings.selectedDays,
      scheduleData: {
        isOpen: true,
        openTime: bulkSettings.openTime,
        closeTime: bulkSettings.closeTime
      }
    }));

    // 清空選擇
    setBulkSettings(prev => ({ ...prev, selectedDays: [] }));
  };

  // 處理批量選擇星期
  const handleBulkDaySelect = (day) => {
    setBulkSettings(prev => ({
      ...prev,
      selectedDays: prev.selectedDays.includes(day)
        ? prev.selectedDays.filter(d => d !== day)
        : [...prev.selectedDays, day]
    }));
  };

  // 儲存排程
  const handleSaveSchedule = async () => {

    if (!merchantId) return;

    try {
      await dispatch(updateMerchantSchedule({
        merchantId,
        scheduleData: { schedule }
      })).unwrap();
      alert('營業排程已更新');
    } catch (error) {
      console.error('更新失敗:', error);
    }
  };

  // 全選/取消全選工作日
  const handleSelectWeekdays = () => {
    const weekdays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];
    setBulkSettings(prev => ({ ...prev, selectedDays: weekdays }));
  };

  // 全選/取消全選週末
  const handleSelectWeekends = () => {
    const weekends = ['saturday', 'sunday'];
    setBulkSettings(prev => ({ ...prev, selectedDays: weekends }));
  };

  // 重設排程
  const handleResetSchedule = () => {
    if (window.confirm('確定要重設所有營業排程嗎？此操作將清除所有設定，恢復為預設狀態。')) {
      dispatch(resetSchedule());
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center p-4">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">載入中...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="card-header">
        <h5 className="card-title mb-0">營業排程設定</h5>
      </div>
      <div className="card-body">
        {error && (
          <div className="alert alert-danger alert-dismissible fade show" role="alert">
            {error}
            <button 
              type="button" 
              className="btn-close" 
              onClick={() => dispatch(clearError())}
            ></button>
          </div>
        )}

        {/* 批量設定區域 */}
        <div className="card mb-4">
          <div className="card-header">
            <h6 className="card-title mb-0">批量設定營業時間</h6>
          </div>
          <div className="card-body">
            <div className="row mb-3">
              <div className="col-md-12">
                <label className="form-label">選擇星期：</label>
                <div className="d-flex flex-wrap gap-2 mb-2">
                  {dayKeys.map(day => (
                    <div key={day} className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id={`bulk-${day}`}
                        checked={bulkSettings.selectedDays.includes(day)}
                        onChange={() => handleBulkDaySelect(day)}
                      />
                      <label className="form-check-label" htmlFor={`bulk-${day}`}>
                        {dayLabels[day]}
                      </label>
                    </div>
                  ))}
                </div>
                <div className="d-flex gap-2">
                  <button 
                    type="button" 
                    className="btn btn-outline-secondary btn-sm"
                    onClick={handleSelectWeekdays}
                  >
                    選擇工作日
                  </button>
                  <button 
                    type="button" 
                    className="btn btn-outline-secondary btn-sm"
                    onClick={handleSelectWeekends}
                  >
                    選擇週末
                  </button>
                </div>
              </div>
            </div>
            
            <div className="row mb-3">
              <div className="col-md-6">
                <label className="form-label">開始時間：</label>
                <input
                  type="time"
                  className="form-control"
                  value={bulkSettings.openTime}
                  onChange={(e) => setBulkSettings(prev => ({ 
                    ...prev, 
                    openTime: e.target.value 
                  }))}
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">結束時間：</label>
                <input
                  type="time"
                  className="form-control"
                  value={bulkSettings.closeTime}
                  onChange={(e) => setBulkSettings(prev => ({ 
                    ...prev, 
                    closeTime: e.target.value 
                  }))}
                />
              </div>
            </div>
            
            <button 
              type="button" 
              className="btn btn-info"
              onClick={handleBulkApply}
            >
              套用設定
            </button>
          </div>
        </div>

        {/* 個別星期設定 */}
        <div className="card mb-4">
          <div className="card-header">
            <h6 className="card-title mb-0">個別星期設定</h6>
          </div>
          <div className="card-body">
            {dayKeys.map(day => (
              <div key={day} className="row mb-3 align-items-center">
                <div className="col-md-2">
                  <strong>{dayLabels[day]}</strong>
                </div>
                <div className="col-md-2">
                  <div className="form-check form-switch">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id={`switch-${day}`}
                      checked={schedule[day].isOpen}
                      onChange={() => handleDayToggle(day)}
                    />
                    <label className="form-check-label" htmlFor={`switch-${day}`}>
                      {schedule[day].isOpen ? '營業' : '休息'}
                    </label>
                  </div>
                </div>
                {schedule[day].isOpen && (
                  <>
                    <div className="col-md-3">
                      <label className="form-label">開始時間：</label>
                      <input
                        type="time"
                        className="form-control"
                        value={schedule[day].openTime}
                        onChange={(e) => handleTimeChange(day, 'openTime', e.target.value)}
                      />
                    </div>
                    <div className="col-md-3">
                      <label className="form-label">結束時間：</label>
                      <input
                        type="time"
                        className="form-control"
                        value={schedule[day].closeTime}
                        onChange={(e) => handleTimeChange(day, 'closeTime', e.target.value)}
                      />
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* 儲存按鈕 */}
        <div className="d-flex justify-content-between">
          <button
            type="button"
            className="btn btn-outline-secondary"
            onClick={handleResetSchedule}
          >
            <i className="fas fa-undo me-2"></i>
            重設排程
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleSaveSchedule}
            disabled={updateLoading}
          >
            {updateLoading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                儲存中...
              </>
            ) : (
              '儲存排程'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ScheduleEdit;