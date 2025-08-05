// features/merchant/setMenu/SetMenuList.jsx
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getEffectiveMerchantId } from '../../../utils/getMerchantId';
import { getFullImageUrl } from '../../../utils/getImageUrl';
import '../../../styles/style.css';
import { 
  fetchSetMenuItems, 
  deleteSetMenuItem, 
  setCurrentItem, 
  clearError,
  SET_MENU_CATEGORIES 
} from './merchantSetMenuSlice';

const SetMenuList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { 
    items = [], 
    loading, 
    error, 
    operationStatus,
    lastFetch 
  } = useSelector(state => state.merchantSetMenu);
  
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [filterCategory, setFilterCategory] = useState('all');
  const rawMerchantId = localStorage.getItem('merchantId');
  const merchantId = getEffectiveMerchantId(rawMerchantId);

  useEffect(() => {
    if (!merchantId) return;
    const shouldRefetch = !lastFetch || (Date.now() - lastFetch > 60000);
    if (shouldRefetch && !loading) {
      dispatch(fetchSetMenuItems());
    }
  }, [dispatch, merchantId, lastFetch, loading]);

  const handleEdit = (item) => {
    dispatch(setCurrentItem(item));
    navigate(`/merchant/set-menu/edit/${item._id}`, { state: { isEdit: true, itemId: item._id } });
  };

  const handleDelete = async (itemId) => {
    if (deleteConfirm === itemId) {
      try {
        await dispatch(deleteSetMenuItem({ itemId })).unwrap();
        setDeleteConfirm(null);
      } catch (err) {
        console.error('刪除失敗:', err);
      }
    } else {
      setDeleteConfirm(itemId);
    }
  };

  const handleAddNew = () => {
    dispatch(setCurrentItem(null));
    navigate('/merchant/set-menu/new', { state: { isEdit: false } });
  };

  const getCategoryLabel = (categoryValue) => {
    const category = SET_MENU_CATEGORIES.find(cat => cat.value === categoryValue);
    return category ? category.label : categoryValue;
  };

  const filteredItems = filterCategory === 'all' 
    ? items 
    : items.filter(item => item.category === filterCategory);

  const formatPrice = (price) => (typeof price === 'number' ? `$${price}` : price);

  const formatItems = (items) => {
    if (!items || !Array.isArray(items)) return '無商品資訊';
    return items.map(item => `${item.name || '未知商品'} x${item.quantity || 1}`).join(', ');
  };

  if (!merchantId) {
    return (
      <div className="container mt-4">
        <div className="alert alert-warning">
          無法取得商家身份，請登入或開啟開發 bypass。 
        </div>
      </div>
    );
  }

  if (loading && !items.length) {
    return (
      <div className="container mt-4">
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">載入中...</span>
          </div>
          <p className="mt-2">載入套餐中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      {/* 標題與操作區 */}
      <div className="row mb-4">
        <div className="col-md-6"><h2>套餐管理</h2></div>
        <div className="col-md-6 text-end">
          <button 
            className="btn btn-primary"
            onClick={handleAddNew}
            disabled={operationStatus.creating}
          >
            {operationStatus.creating ? '新增中...' : '新增套餐'}
          </button>
        </div>
      </div>

      {error && (
        <div className="alert alert-danger alert-dismissible fade show" role="alert">
          {error}
          <button type="button" className="btn-close" onClick={() => dispatch(clearError())}></button>
        </div>
      )}

      {/* 分類篩選 */}
      <div className="row mb-3">
        <div className="col-md-4">
          <select className="form-select" value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
            <option value="all">所有類別</option>
            {SET_MENU_CATEGORIES.map(category => (
              <option key={category.value} value={category.value}>{category.label}</option>
            ))}
          </select>
        </div>
        <div className="col-md-8">
          <small className="text-muted">共 {filteredItems.length} 項套餐</small>
        </div>
      </div>

      {/* 套餐列表 */}
      {filteredItems.length === 0 ? (
        <div className="text-center py-5">
          <p className="text-muted">
            {filterCategory === 'all' ? '尚未新增任何套餐' : '此類別暫無套餐'}
          </p>
          {filterCategory === 'all' && (
            <button className="btn btn-outline-primary" onClick={handleAddNew}>
              新增第一個套餐
            </button>
          )}
        </div>
      ) : (
        <div className="row">
          {filteredItems.map((item) => {
            const imageUrlRaw = item.imageUrl || (item.imagePath ? `/images/${item.imagePath.replace(/\\+/g, '/')}` : null);
            return (
              <div key={item._id} className="col-lg-6 col-xl-4 mb-4">
                <div className="card h-100">
                  {imageUrlRaw && (
                    <img
                      src={getFullImageUrl(imageUrlRaw)}
                      className="card-img-top"
                      alt={item.name}
                      style={{ height: '200px', objectFit: 'cover' }}
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                  )}
                  <div className="card-body d-flex flex-column">
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <h5 className="card-title mb-0">{item.name}</h5>
                      <span className="badge bg-info">{getCategoryLabel(item.category)}</span>
                    </div>
                    {item.description && (
                      <p className="card-text text-muted small mb-2">{item.description}</p>
                    )}
                    <div className="mb-2">
                      <strong className="text-primary">{formatPrice(item.price)}</strong>
                    </div>
                    {item.items && item.items.length > 0 && (
                      <div className="mb-2">
                        <small className="text-info">
                          <strong>包含:</strong> {formatItems(item.items)}
                        </small>
                      </div>
                    )}
                    {item.notes && (
                      <div className="mb-2">
                        <small className="text-secondary">
                          <strong>備註:</strong> {item.notes}
                        </small>
                      </div>
                    )}
                    <div className="mb-3">
                      <span className={`badge ${item.available ? 'bg-success' : 'bg-danger'}`}>
                        {item.available ? '供應中' : '暫停供應'}
                      </span>
                    </div>
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
                          className={`btn btn-sm flex-fill ${deleteConfirm === item._id ? 'btn-danger' : 'btn-outline-danger'}`}
                          onClick={() => handleDelete(item._id)}
                          disabled={operationStatus.deleting}
                        >
                          {deleteConfirm === item._id ? '確認刪除' : '刪除'}
                        </button>
                      </div>
                      {deleteConfirm === item._id && (
                        <button className="btn btn-link btn-sm mt-1 p-0" onClick={() => setDeleteConfirm(null)}>
                          取消
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {(operationStatus.creating || operationStatus.updating || operationStatus.deleting) && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
          style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 9999 }}
        >
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

export default SetMenuList;