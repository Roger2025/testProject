// features/merchant/menu/MenuEdit.jsx
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  createMenuItem, 
  updateMenuItem, 
  clearCurrentItem,
  clearError,
  MENU_CATEGORIES,
  DRINK_OPTIONS
} from './merchantMenuSlice';

const MenuEdit = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  
  const { currentItem, operationStatus, error } = useSelector(state => state.merchantMenu);
  const isEdit = location.state?.isEdit || false;
  const itemId = location.state?.itemId;
  
  // 從 localStorage 或其他方式獲取商家ID
  const merchantId = localStorage.getItem('merchantId') || 'default_merchant';
  
  // 表單狀態
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'burger',
    available: true,
    notes: '',
    options: {}
  });
  
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [showOptions, setShowOptions] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState({
    size: [],
    temperature: []
  });

  // 初始化表單數據
  useEffect(() => {
    if (isEdit && currentItem) {
      setFormData({
        name: currentItem.name || '',
        description: currentItem.description || '',
        price: currentItem.price || '',
        category: currentItem.category || 'burger',
        available: currentItem.available !== undefined ? currentItem.available : true,
        notes: currentItem.notes || '',
        options: currentItem.options || {}
      });
      
      if (currentItem.imageUrl) {
        setImagePreview(currentItem.imageUrl);
      }
      
      // 設置選項
      if (currentItem.options) {
        setSelectedOptions({
          size: currentItem.options.size || [],
          temperature: currentItem.options.temperature || []
        });
        setShowOptions(currentItem.category === 'drink');
      }
    } else {
      // 新增模式，重置表單
      setFormData({
        name: '',
        description: '',
        price: '',
        category: 'burger',
        available: true,
        notes: '',
        options: {}
      });
      setImageFile(null);
      setImagePreview('');
      setSelectedOptions({ size: [], temperature: [] });
      setShowOptions(false);
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
    
    if (name === 'category') {
      setShowOptions(value === 'drink');
      if (value !== 'drink') {
        setSelectedOptions({ size: [], temperature: [] });
      }
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // 檢查文件大小 (限制5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('圖片大小不能超過 5MB');
        return;
      }
      
      // 檢查文件類型
      if (!file.type.startsWith('image/')) {
        alert('請選擇圖片文件');
        return;
      }
      
      setImageFile(file);
      
      // 創建預覽
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleOptionChange = (optionType, option, checked) => {
    setSelectedOptions(prev => ({
      ...prev,
      [optionType]: checked 
        ? [...prev[optionType], option]
        : prev[optionType].filter(item => item.value !== option.value)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // 驗證必填欄位
    if (!formData.name.trim()) {
      alert('請輸入餐點名稱');
      return;
    }
    
    if (!formData.price || parseFloat(formData.price) <= 0) {
      alert('請輸入有效的價格');
      return;
    }
    
    // 準備提交數據
    const submitData = {
      ...formData,
      price: parseFloat(formData.price),
      options: showOptions ? selectedOptions : {}
    };
    
    try {
      if (isEdit) {
        await dispatch(updateMenuItem({
          itemId: itemId,
          menuData: submitData,
          imageFile
        })).unwrap();
      } else {
        await dispatch(createMenuItem({
          merchantId,
          menuData: submitData,
          imageFile
        })).unwrap();
      }
      
      // 成功後返回列表頁
      navigate('/merchant/menu');
    } catch (error) {
      console.error('提交失敗:', error);
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
              <h4 className="mb-0">
                {isEdit ? '編輯餐點' : '新增餐點'}
              </h4>
            </div>
            
            <div className="card-body">
              {error && (
                <div className="alert alert-danger">
                  {error}
                </div>
              )}
              
              <form onSubmit={handleSubmit}>
                {/* 基本資訊 */}
                <div className="row mb-3">
                  <div className="col-md-6">
                    <label className="form-label">餐點名稱 *</label>
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
                      {MENU_CATEGORIES.map(category => (
                        <option key={category.value} value={category.value}>
                          {category.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label">描述</label>
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
                      <label className="form-check-label">
                        供應中
                      </label>
                    </div>
                  </div>
                </div>

                {/* 餐點圖片 */}
                <div className="mb-3">
                  <label className="form-label">餐點圖片</label>
                  <input
                    type="file"
                    className="form-control"
                    accept="image/*"
                    onChange={handleImageChange}
                    disabled={isSubmitting}
                  />
                  <div className="form-text">
                    支援 JPG、PNG、GIF 格式，檔案大小不超過 5MB
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

                {/* 飲料選項 */}
                {showOptions && (
                  <div className="mb-3">
                    <h6>飲料選項設定</h6>
                    
                    {/* 尺寸選項 */}
                    <div className="mb-3">
                      <label className="form-label">尺寸選項</label>
                      <div className="row">
                        {DRINK_OPTIONS.size.map(size => (
                          <div key={size.value} className="col-md-4">
                            <div className="form-check">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                checked={selectedOptions.size.some(s => s.value === size.value)}
                                onChange={(e) => handleOptionChange('size', size, e.target.checked)}
                                disabled={isSubmitting}
                              />
                              <label className="form-check-label">
                                {size.label} {size.price > 0 && `(+${size.price})`}
                              </label>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* 溫度選項 */}
                    <div className="mb-3">
                      <label className="form-label">溫度選項</label>
                      <div className="row">
                        {DRINK_OPTIONS.temperature.map(temp => (
                          <div key={temp.value} className="col-md-3">
                            <div className="form-check">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                checked={selectedOptions.temperature.some(t => t.value === temp.value)}
                                onChange={(e) => handleOptionChange('temperature', temp, e.target.checked)}
                                disabled={isSubmitting}
                              />
                              <label className="form-check-label">
                                {temp.label}
                              </label>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* 備註 */}
                <div className="mb-3">
                  <label className="form-label">備註</label>
                  <textarea
                    className="form-control"
                    name="notes"
                    rows="2"
                    value={formData.notes}
                    onChange={handleInputChange}
                    placeholder="其他特殊需求或說明..."
                    disabled={isSubmitting}
                  />
                </div>

                {/* 提交按鈕 */}
                <div className="d-flex gap-2 justify-content-end">
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={handleCancel}
                    disabled={isSubmitting}
                  >
                    取消
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                        {isEdit ? '更新中...' : '新增中...'}
                      </>
                    ) : (
                      isEdit ? '更新餐點' : '新增餐點'
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

export default MenuEdit;