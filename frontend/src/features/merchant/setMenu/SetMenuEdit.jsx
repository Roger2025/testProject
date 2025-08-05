// features/merchant/setMenu/SetMenuEdit.jsx
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { getEffectiveMerchantId } from '../../../utils/getMerchantId';
import { getFullImageUrl } from '../../../utils/getImageUrl';
import {
  fetchMenuItems as fetchSingleMenuItems
} from '../menu/merchantMenuSlice'; // 從單品的slice拿取單品內容
import {
  createSetMenuItem,
  updateSetMenuItem,
  clearCurrentItem,
  clearError,
  SET_MENU_CATEGORIES 
} from './merchantSetMenuSlice';

const SetMenuEdit = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { currentItem, operationStatus, error } = useSelector(state => state.merchantSetMenu);
  const { items: singleItems = [] } = useSelector(state => state.merchantMenu); // 單品清單
  const isEdit = location.state?.isEdit || false;
  const itemId = location.state?.itemId;

  const rawMerchantId = localStorage.getItem('merchantId');
  const merchantId = getEffectiveMerchantId(rawMerchantId);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'breakfast',
    available: true,
    notes: '',
    items: [] // 每個 { menuId, quantity, note }
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');

  // 載入單品供下拉選
  useEffect(() => {
    if (merchantId) {
      dispatch(fetchSingleMenuItems()); // slice 內會自己 resolve merchantId
    }
  }, [dispatch, merchantId]);

  // 初始化表單
  useEffect(() => {
    if (isEdit && currentItem) {
      setFormData({
        name: currentItem.name || '',
        description: currentItem.description || '',
        price: currentItem.price || '',
        category: currentItem.category || 'breakfast',
        available: currentItem.available !== undefined ? currentItem.available : true,
        notes: currentItem.notes || '',
        // Normalize existing items: if they have menuId or previous representation
        items: Array.isArray(currentItem.items) ? currentItem.items.map(it => ({
          menuId: it.menuId || it._id || '', // fallback
          quantity: it.quantity ?? 1,
          note: it.note || ''
        })) : []
      });

      if (currentItem.imageUrl) {
        setImagePreview(getFullImageUrl(currentItem.imageUrl));
      } else if (currentItem.imagePath) {
        setImagePreview(getFullImageUrl(`/images/${currentItem.imagePath.replace(/\\+/g, '/')}`));
      }
    } else {
      setFormData({
        name: '',
        description: '',
        price: '',
        category: 'breakfast',
        available: true,
        notes: '',
        items: []
      });
      setImageFile(null);
      setImagePreview('');
    }
  }, [isEdit, currentItem]);

  // 清理錯誤
  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 300 * 1024) {
      alert('圖片大小不能超過 300KB');
      return;
    }
    if (!file.type.startsWith('image/')) {
      alert('請選擇圖片文件');
      return;
    }
    setImageFile(file);
    const reader = new FileReader();
    reader.onload = (ev) => setImagePreview(ev.target.result);
    reader.readAsDataURL(file);
  };

  // 套餐項目操作
  const handleAddItem = () => {
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, { menuId: '', quantity: 1, note: '' }]
    }));
  };

  const handleRemoveItem = (index) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }));
  };

  const handleItemChange = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.map((it, i) =>
        i === index ? { ...it, [field]: value } : it
      )
    }));
  };

  const validateItems = (items) => {
    if (!Array.isArray(items) || items.length === 0) {
      return '套餐至少要包含一個餐點';
    }
    for (const it of items) {
      if (!it.menuId) return '每個套餐項目必須選擇一個已存在的餐點';
      if (!it.quantity || Number(it.quantity) < 1) return '每個餐點數量至少為 1';
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!merchantId) {
      alert('缺少商家身份，請先登入');
      return;
    }

    if (!formData.name.trim()) {
      alert('請輸入套餐名稱');
      return;
    }
    if (!formData.price || parseFloat(formData.price) <= 0) {
      alert('請輸入有效的價格');
      return;
    }

    const itemsError = validateItems(formData.items);
    if (itemsError) {
      alert(itemsError);
      return;
    }

    const submitData = {
      ...formData,
      price: parseFloat(formData.price),
      items: formData.items.map(it => ({
        menuId: it.menuId,
        quantity: Number(it.quantity),
        note: it.note?.trim() || ''
      }))
    };

    const payload = {
      merchantId,
      setMenuData: submitData,
      imageFile
    };

    try {
      if (isEdit) {
        await dispatch(updateSetMenuItem({ ...payload, itemId })).unwrap();
      } else {
        await dispatch(createSetMenuItem(payload)).unwrap();
      }
      navigate('/merchant/menu');
    } catch (err) {
      console.error('提交失敗:', err);
      alert(typeof err === 'string' ? err : '提交失敗，請稍後再試');
    }
  };

  const handleCancel = () => {
    dispatch(clearCurrentItem());
    navigate('/merchant/menu');
  };

  const isSubmitting = operationStatus.creating || operationStatus.updating;

  return (
    <div className="container mt-4">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card">
            <div className="card-header">
              <h4 className="mb-0">{isEdit ? '編輯套餐' : '新增套餐'}</h4>
            </div>
            <div className="card-body">
              {error && <div className="alert alert-danger">{error}</div>}
              <form onSubmit={handleSubmit}>
                {/* 基本資訊 */}
                <div className="row mb-3">
                  <div className="col-md-6">
                    <label className="form-label">套餐名稱 *</label>
                    <input
                      type="text"
                      className="form-control"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      disabled={isSubmitting}
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">類別 *</label>
                    <select
                      className="form-select"
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      disabled={isSubmitting}
                    >
                      {SET_MENU_CATEGORIES.map(cat => (
                        <option key={cat.value} value={cat.value}>
                          {cat.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label">套餐描述</label>
                  <textarea
                    className="form-control"
                    name="description"
                    rows="3"
                    value={formData.description}
                    onChange={handleInputChange}
                    disabled={isSubmitting}
                  />
                </div>

                <div className="row mb-3">
                  <div className="col-md-6">
                    <label className="form-label">價格 *</label>
                    <div className="input-group">
                      <span className="input-group-text">$</span>
                      <input
                        type="number"
                        className="form-control"
                        name="price"
                        value={formData.price}
                        onChange={handleInputChange}
                        min="0"
                        step="1"
                        required
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">狀態</label>
                    <div className="form-check mt-2">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        name="available"
                        checked={formData.available}
                        onChange={handleInputChange}
                        disabled={isSubmitting}
                      />
                      <label className="form-check-label">供應中</label>
                    </div>
                  </div>
                </div>

                {/* 圖片 */}
                <div className="mb-3">
                  <label className="form-label">套餐圖片</label>
                  <input
                    type="file"
                    className="form-control"
                    accept="image/*"
                    onChange={handleImageChange}
                    disabled={isSubmitting}
                  />
                  <div className="form-text">
                    支援 JPG、PNG、GIF 格式，檔案大小不超過 300KB
                  </div>
                  {imagePreview && (
                    <div className="mt-2">
                      <img
                        src={imagePreview}
                        alt="預覽"
                        className="img-thumbnail"
                        style={{ maxWidth: '200px', maxHeight: '200px' }}
                      />
                    </div>
                  )}
                </div>

                {/* 套餐內容：從已有單品選 */}
                <div className="mb-4">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <h6>套餐內容</h6>
                    <button
                      type="button"
                      className="btn btn-outline-primary btn-sm"
                      onClick={handleAddItem}
                      disabled={isSubmitting}
                    >
                      新增商品
                    </button>
                  </div>
                  {formData.items.map((it, idx) => (
                    <div key={idx} className="card mb-2 p-2">
                      <div className="row g-2 align-items-center">
                        <div className="col-md-5">
                          <label className="form-label small">已選餐點 *</label>
                          <select
                            className="form-select"
                            value={it.menuId}
                            onChange={(e) => handleItemChange(idx, 'menuId', e.target.value)}
                            disabled={isSubmitting}
                            required
                          >
                            <option value="">-- 選擇餐點 --</option>
                            {singleItems.map(si => (
                              <option key={si._id} value={si._id}>
                                {si.name} {typeof si.price === 'number' ? `($${si.price})` : ''}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="col-md-2">
                          <label className="form-label small">數量</label>
                          <input
                            type="number"
                            className="form-control"
                            min="1"
                            value={it.quantity}
                            onChange={(e) => handleItemChange(idx, 'quantity', e.target.value)}
                            disabled={isSubmitting}
                          />
                        </div>
                        <div className="col-md-4">
                          <label className="form-label small">備註</label>
                          <input
                            type="text"
                            className="form-control"
                            value={it.note}
                            onChange={(e) => handleItemChange(idx, 'note', e.target.value)}
                            disabled={isSubmitting}
                          />
                        </div>
                        <div className="col-md-1 d-flex align-items-end">
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => handleRemoveItem(idx)}
                            disabled={isSubmitting}
                          >
                            ✕
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                  {formData.items.length === 0 && (
                    <div className="text-muted">請新增至少一個已有的餐點作為套餐內容。</div>
                  )}
                </div>

                {/* 備註 */}
                <div className="mb-3">
                  <label className="form-label">備註</label>
                  <textarea
                    className="form-control"
                    name="notes"
                    rows="2"
                    value={formData.notes}
                    onChange={handleInputChange}
                    disabled={isSubmitting}
                  />
                </div>

                {/* 按鈕 */}
                <div className="d-flex gap-2 justify-content-end">
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={handleCancel}
                    disabled={isSubmitting}
                  >
                    取消
                  </button>
                  <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                        {isEdit ? '更新中...' : '新增中...'}
                      </>
                    ) : (
                      isEdit ? '更新套餐' : '新增套餐'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SetMenuEdit;