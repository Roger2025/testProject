// features/merchant/menu/MenuList.jsx
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
// import { Container, Row, Col, Table, Button, Badge, Alert, Modal, Spinner as BootstrapSpinner } from 'react-bootstrap';
import '../../../styles/style.css';
import { 
  fetchMenuItems, 
  deleteMenuItem, 
  setCurrentItem, 
  clearError,
  MENU_CATEGORIES 
} from './merchantMenuSlice';

const MenuList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { 
    items, 
    loading, 
    error, 
    operationStatus,
    lastFetch 
  } = useSelector(state => state.merchantMenu);
  
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [filterCategory, setFilterCategory] = useState('all');
  const [hasInitialFetch, setHasInitialFetch] = useState(false); // 新增：追蹤是否已初始化
  
  // 從 localStorage 或其他方式獲取商家ID
  const merchantId = localStorage.getItem('merchantId') || 'default_merchant';

  useEffect(() => {
    // 修正：只在首次載入或數據過期時獲取，避免無限迴圈
    const shouldRefetch = !hasInitialFetch || (!lastFetch || (Date.now() - lastFetch > 60000));
    
    if (shouldRefetch && !loading) { // 新增：確保不在載入中時才發請求
      setHasInitialFetch(true);
      dispatch(fetchMenuItems(merchantId));
    }
  }, [dispatch, merchantId, hasInitialFetch, lastFetch, loading]);

  // 移除這個 useEffect，因為會造成無限迴圈
  // useEffect(() => {
  //   if (error && items.length === 0) {
  //     dispatch(fetchMenuItems(merchantId));
  //   }
  // }, [error, items.length, dispatch, merchantId]);

  const handleEdit = (item) => {
    dispatch(setCurrentItem(item));
    navigate(`/merchant/menus/edit/${item._id}`, { state: { isEdit: true, itemId: item._id } });
  };

  const handleDelete = async (itemId) => {
    if (deleteConfirm === itemId) {
      try {
        await dispatch(deleteMenuItem(itemId)).unwrap();
        setDeleteConfirm(null);
      } catch (error) {
        console.error('刪除失敗:', error);
      }
    } else {
      setDeleteConfirm(itemId);
    }
  };

  const handleAddNew = () => {
    dispatch(setCurrentItem(null));
    navigate('/merchant/menus/new', { state: { isEdit: false } });
  };

  const getCategoryLabel = (categoryValue) => {
    const category = MENU_CATEGORIES.find(cat => cat.value === categoryValue);
    return category ? category.label : categoryValue;
  };

  // 防呆處理
  const validItems = Array.isArray(items) ? items : [];

  const filteredItems = filterCategory === 'all' 
    ? validItems 
    : validItems.filter(item => item.category === filterCategory);

  const formatPrice = (price) => {
    return typeof price === 'number' ? `$${price}` : price;
  };

  const formatOptions = (options) => {
    if (!options || typeof options !== 'object') return '';
    
    const optionTexts = [];
    if (options.size) optionTexts.push(`尺寸選項: ${options.size.map(s => s.label).join(', ')}`);
    if (options.temperature) optionTexts.push(`溫度選項: ${options.temperature.map(t => t.label).join(', ')}`);
    
    return optionTexts.join(' | ');
  };

  // 修正：只在首次載入且正在載入時顯示載入畫面
  if (loading && !hasInitialFetch) {
    return (
      <div className="container mt-4">
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">載入中...</span>
          </div>
          <p className="mt-2">載入菜單中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      {/* 標題與操作區 */}
      <div className="row mb-4">
        <div className="col-md-6">
          <h2>菜單管理</h2>
        </div>
        <div className="col-md-6 text-end">
          <button 
            className="btn btn-primary"
            onClick={handleAddNew}
            disabled={operationStatus.creating}
          >
            {operationStatus.creating ? '新增中...' : '新增餐點'}
          </button>
        </div>
      </div>

      {/* 錯誤訊息 */}
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

      {/* 分類篩選 */}
      <div className="row mb-3">
        <div className="col-md-4">
          <select 
            className="form-select"
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
          >
            <option value="all">所有類別</option>
            {MENU_CATEGORIES.map(category => (
              <option key={category.value} value={category.value}>
                {category.label}
              </option>
            ))}
          </select>
        </div>
        <div className="col-md-8">
          <small className="text-muted">
            共 {filteredItems.length} 項餐點
          </small>
        </div>
      </div>

      {/* 餐點列表 */}
      {filteredItems.length === 0 ? (
        <div className="text-center py-5">
          <p className="text-muted">
            {filterCategory === 'all' ? '尚未新增任何餐點' : '此類別暫無餐點'}
          </p>
          {filterCategory === 'all' && (
            <button className="btn btn-outline-primary" onClick={handleAddNew}>
              新增第一個餐點
            </button>
          )}
        </div>
      ) : (
        <div className="row">
          {filteredItems.map((item) => (
            <div key={item._id} className="col-lg-6 col-xl-4 mb-4">
              <div className="card h-100">
                {/* 餐點圖片 */}
                {item.imageUrl && (
                  <img 
                    src={item.imageUrl} 
                    className="card-img-top" 
                    alt={item.name}
                    style={{ height: '200px', objectFit: 'cover' }}
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                )}
                
                <div className="card-body d-flex flex-column">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <h5 className="card-title mb-0">{item.name}</h5>
                    <span className="badge bg-secondary">
                      {getCategoryLabel(item.category)}
                    </span>
                  </div>
                  
                  {item.description && (
                    <p className="card-text text-muted small mb-2">
                      {item.description}
                    </p>
                  )}
                  
                  <div className="mb-2">
                    <strong className="text-primary">
                      {formatPrice(item.price)}
                    </strong>
                  </div>
                  
                  {/* 選項顯示 */}
                  {item.options && (
                    <div className="mb-2">
                      <small className="text-info">
                        {formatOptions(item.options)}
                      </small>
                    </div>
                  )}
                  
                  {/* 備註 */}
                  {item.notes && (
                    <div className="mb-2">
                      <small className="text-secondary">
                        <strong>備註:</strong> {item.notes}
                      </small>
                    </div>
                  )}
                  
                  {/* 狀態 */}
                  <div className="mb-3">
                    <span className={`badge ${item.available ? 'bg-success' : 'bg-danger'}`}>
                      {item.available ? '供應中' : '暫停供應'}
                    </span>
                  </div>
                  
                  {/* 操作按鈕 */}
                  <div className="mt-auto">
                    <div className="d-flex gap-2">
                      <button
                        className="btn btn-outline-primary btn-sm flex-fill"
                        onClick={() => handleEdit(item)}
                        disabled={operationStatus.updating}
                      >
                        編輯
                      </button>
                      <button
                        className={`btn btn-sm flex-fill ${
                          deleteConfirm === item._id 
                            ? 'btn-danger' 
                            : 'btn-outline-danger'
                        }`}
                        onClick={() => handleDelete(item._id)}
                        disabled={operationStatus.deleting}
                      >
                        {deleteConfirm === item._id ? '確認刪除' : '刪除'}
                      </button>
                    </div>
                    
                    {deleteConfirm === item._id && (
                      <button
                        className="btn btn-link btn-sm mt-1 p-0"
                        onClick={() => setDeleteConfirm(null)}
                      >
                        取消
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* 載入中覆層 */}
      {(operationStatus.creating || operationStatus.updating || operationStatus.deleting) && (
        <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center" 
             style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 9999 }}>
          <div className="text-center text-white">
            <div className="spinner-border mb-2" role="status"></div>
            <div>
              {operationStatus.creating && '新增中...'}
              {operationStatus.updating && '更新中...'}
              {operationStatus.deleting && '刪除中...'}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MenuList;