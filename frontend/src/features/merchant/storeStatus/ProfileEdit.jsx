// src/features/merchant/storeStatus/ProfileEdit.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  fetchMerchantProfile,
  updateMerchantProfile,
  uploadMerchantLogo,
  clearProfileMessages,
} from './merchantProfileSlice';
import { merchantApi } from '../../../services/merchantApi';

// 與後端 CATEGORY_KEYS 對齊
const CATEGORY_OPTIONS = [
  { value: 'delivery', label: '可外送' },
  { value: 'online_payment', label: '可線上支付' },
  { value: 'pickup', label: '可自取' },
  { value: 'cash_only', label: '僅收現金' },
];

// 先不擋任何欄位（category 要可更新）
const READONLY_FIELDS = [];

const ProfileEdit = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // 先取得 slice（可能為 undefined）
  const slice = useSelector((s) => s.merchantProfile);

  // 從 slice 派生資料（避免 slice 未註冊導致崩潰）
  const profile = slice?.profile || null;
  const loading = !!slice?.loading;
  const error = slice?.error ?? null;
  const successMessage = slice?.successMessage ?? null;
  const uploadLoading = !!slice?.uploadLoading;

  // ---- Hooks：無條件呼叫（避免 hooks 順序問題）----
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    storeName: '',
    storeAddress: '',
    category: {}, // 物件：{ delivery:true, ... }
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const fileInputRef = useRef(null);

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 進頁讀取
  useEffect(() => {
    dispatch(fetchMerchantProfile());
  }, [dispatch]);

  // profile -> 表單/圖片
  useEffect(() => {
    if (!profile) return;

    setFormData({
      name: profile.name || '',
      email: profile.email || '',
      phone: profile.phone || '',
      storeName: profile.storeName || '',
      storeAddress: profile.storeAddress || '',
      category:
        profile.category && typeof profile.category === 'object' ? profile.category : {},
    });

    if (profile.storeImage) {
      setImagePreview(merchantApi.getImageUrl(profile.storeImage));
    } else if (profile.storeImag) {
      // 後端 DB 儲存的是 "merchantId/Logo.jpg"
      setImagePreview(merchantApi.getImageUrl(`/images/${profile.storeImag}`));
    } else {
      setImagePreview('');
    }
  }, [profile]);

  // 卸載時清訊息
  useEffect(() => {
    return () => {
      dispatch(clearProfileMessages());
    };
  }, [dispatch]);

  // ---- Handlers ----
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const toggleCategory = (key) => {
    setFormData((prev) => ({
      ...prev,
      category: { ...(prev.category || {}), [key]: !prev?.category?.[key] },
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      setErrors((prev) => ({ ...prev, image: '請選擇 JPG/PNG/GIF/WebP 圖片' }));
      return;
    }
    if (file.size > 300 * 1024) {
      setErrors((prev) => ({ ...prev, image: '圖片檔案不能超過 300KB' }));
      return;
    }

    setImageFile(file);
    const reader = new FileReader();
    reader.onload = (ev) => setImagePreview(ev.target?.result || '');
    reader.readAsDataURL(file);

    if (errors.image) setErrors((prev) => ({ ...prev, image: '' }));
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.storeName.trim()) newErrors.storeName = '店家名稱為必填項目';
    if (!formData.storeAddress.trim()) newErrors.storeAddress = '店家地址為必填項目';
    if (formData.email && !/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = 'Email 格式不正確';
    }
    if (formData.phone && !/^[\d+()\s-]+$/.test(formData.phone)) {
      newErrors.phone = '電話號碼格式不正確';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const buildUpdatablePayload = (data) => {
    const payload = { ...data };
    // 目前不擋任何欄位（若未來要擋可把 key 塞進 READONLY_FIELDS）
    READONLY_FIELDS.forEach((key) => delete payload[key]);

    // category 僅保留布林
    if (payload.category && typeof payload.category === 'object') {
      const clean = {};
      for (const [k, v] of Object.entries(payload.category)) clean[k] = !!v;
      payload.category = clean;
    }
    return payload;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);
    try {
      const payload = buildUpdatablePayload(formData);
      await dispatch(updateMerchantProfile(payload)).unwrap();
      if (imageFile) {
        await dispatch(uploadMerchantLogo(imageFile)).unwrap();
      }
      dispatch(fetchMerchantProfile());
    } catch (err) {
      console.error('更新失敗:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => navigate('/merchant/dashboard');

  // ---- Render ----
  // 若 slice 未註冊，仍然要讓 hooks 被呼叫；這裡改為顯示提醒區塊（不提前 return）
  const showSliceWarning = !slice;

  // 是否有任何系統 tag（true 才顯示）
  const hasAnyTag = profile?.tag && Object.values(profile.tag).some(Boolean);

  return (
    <div className="container-fluid px-4">
      {showSliceWarning && (
        <div className="alert alert-warning my-3">
          Redux: merchantProfile 未註冊（請檢查 store/combineReducers 與 Provider 包裹）。
        </div>
      )}

      <div className="row">
        <div className="col-12">
          {/* 標題 */}
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h1 className="h3 mb-1">商家基本資料</h1>
              <p className="text-muted">管理您的店家基本資訊</p>
              {hasAnyTag && (
                <div className="mt-2">
                  {Object.entries(profile.tag)
                    .filter(([, v]) => v)
                    .map(([k]) => (
                      <span key={k} className="badge bg-warning text-dark me-2">
                        {k === 'best_seller'
                          ? '最暢銷'
                          : k === 'popular_item'
                          ? '最受歡迎'
                          : k === 'trending'
                          ? '趨勢熱門'
                          : k}
                      </span>
                    ))}
                </div>
              )}
            </div>
            <button type="button" className="btn btn-outline-secondary" onClick={handleBack}>
              <i className="fas fa-arrow-left me-2"></i>
              返回
            </button>
          </div>

          {/* 訊息 */}
          {error && (
            <div className="alert alert-danger alert-dismissible fade show" role="alert">
              <i className="fas fa-exclamation-triangle me-2"></i>
              {String(error)}
              <button
                type="button"
                className="btn-close"
                onClick={() => dispatch(clearProfileMessages())}
              ></button>
            </div>
          )}
          {successMessage && (
            <div className="alert alert-success alert-dismissible fade show" role="alert">
              <i className="fas fa-check-circle me-2"></i>
              {successMessage}
              <button
                type="button"
                className="btn-close"
                onClick={() => dispatch(clearProfileMessages())}
              ></button>
            </div>
          )}

          {/* 主要內容 */}
          <div className="row">
            <div className="col-xl-8 col-lg-10">
              <div className="card shadow-sm">
                <div className="card-header bg-white">
                  <h5 className="card-title mb-0">
                    <i className="fas fa-store me-2 text-primary"></i>
                    店家資訊編輯
                  </h5>
                </div>

                <div className="card-body">
                  {/* 載入骨架 */}
                  {loading && !profile ? (
                    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: 200 }}>
                      <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">載入中...</span>
                      </div>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit}>
                      {/* 店家圖片 */}
                      <div className="row mb-4">
                        <div className="col-12">
                          <label className="form-label fw-bold">店家圖片</label>
                          <div className="d-flex align-items-start gap-3">
                            <div className="position-relative">
                              {imagePreview ? (
                                <div className="position-relative">
                                  <img
                                    src={imagePreview}
                                    alt="店家圖片預覽"
                                    className="rounded border"
                                    style={{ width: '120px', height: '120px', objectFit: 'cover' }}
                                  />
                                  <button
                                    type="button"
                                    className="btn btn-danger btn-sm position-absolute top-0 start-100 translate-middle rounded-circle p-1"
                                    style={{ width: '24px', height: '24px' }}
                                    onClick={handleRemoveImage}
                                    title="移除圖片"
                                  >
                                    <i className="fas fa-times" style={{ fontSize: '10px' }}></i>
                                  </button>
                                </div>
                              ) : (
                                <div
                                  className="border border-dashed rounded d-flex align-items-center justify-content-center text-muted"
                                  style={{ width: '120px', height: '120px' }}
                                >
                                  <div className="text-center">
                                    <i className="fas fa-image fs-3 mb-2"></i>
                                    <div className="small">無圖片</div>
                                  </div>
                                </div>
                              )}
                            </div>

                            <div>
                              <input
                                ref={fileInputRef}
                                type="file"
                                id="storeImage"
                                className="form-control"
                                accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                                onChange={handleImageChange}
                              />
                              <div className="form-text">
                                支援 JPG/PNG/GIF/WebP，檔案大小不超過 300KB
                              </div>
                              {errors.image && <div className="text-danger small mt-1">{errors.image}</div>}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* 基本資訊 */}
                      <div className="row">
                        <div className="col-md-6 mb-3">
                          <label htmlFor="storeName" className="form-label fw-bold">
                            店家名稱 <span className="text-danger">*</span>
                          </label>
                          <input
                            type="text"
                            className={`form-control ${errors.storeName ? 'is-invalid' : ''}`}
                            id="storeName"
                            name="storeName"
                            value={formData.storeName}
                            onChange={handleInputChange}
                            placeholder="請輸入店家名稱"
                          />
                          {errors.storeName && <div className="invalid-feedback">{errors.storeName}</div>}
                        </div>

                        <div className="col-md-6 mb-3">
                          <label htmlFor="phone" className="form-label fw-bold">聯絡電話</label>
                          <input
                            type="tel"
                            className={`form-control ${errors.phone ? 'is-invalid' : ''}`}
                            id="phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            placeholder="請輸入聯絡電話"
                          />
                          {errors.phone && <div className="invalid-feedback">{errors.phone}</div>}
                        </div>

                        <div className="col-12 mb-3">
                          <label htmlFor="storeAddress" className="form-label fw-bold">
                            店家地址 <span className="text-danger">*</span>
                          </label>
                          <input
                            type="text"
                            className={`form-control ${errors.storeAddress ? 'is-invalid' : ''}`}
                            id="storeAddress"
                            name="storeAddress"
                            value={formData.storeAddress}
                            onChange={handleInputChange}
                            placeholder="請輸入完整店家地址"
                          />
                          {errors.storeAddress && <div className="invalid-feedback">{errors.storeAddress}</div>}
                        </div>

                        <div className="col-md-6 mb-3">
                          <label htmlFor="name" className="form-label fw-bold">負責人姓名</label>
                          <input
                            type="text"
                            className="form-control"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            placeholder="請輸入負責人姓名"
                          />
                        </div>

                        <div className="col-md-6 mb-3">
                          <label htmlFor="email" className="form-label fw-bold">聯絡信箱</label>
                          <input
                            type="email"
                            className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            placeholder="請輸入聯絡信箱"
                          />
                          {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                        </div>

                        {/* Category（可多選，物件布林） */}
                        <div className="col-12 mb-3">
                          <label className="form-label fw-bold">店家標籤（可多選）</label>
                          <div className="d-flex flex-wrap gap-3">
                            {CATEGORY_OPTIONS.map((opt) => (
                              <div className="form-check" key={opt.value}>
                                <input
                                  className="form-check-input"
                                  type="checkbox"
                                  id={`cat-${opt.value}`}
                                  checked={!!formData.category?.[opt.value]}
                                  onChange={() => toggleCategory(opt.value)}
                                />
                                <label className="form-check-label" htmlFor={`cat-${opt.value}`}>
                                  {opt.label}
                                </label>
                              </div>
                            ))}
                          </div>
                          <div className="form-text">這些標籤會影響前台顯示與搜尋篩選。</div>
                        </div>
                      </div>

                      {/* 動作 */}
                      <div className="d-flex justify-content-end gap-3 mt-4">
                        <button
                          type="button"
                          className="btn btn-outline-secondary"
                          onClick={handleBack}
                          disabled={isSubmitting}
                        >
                          取消
                        </button>
                        <button
                          type="submit"
                          className="btn btn-primary"
                          disabled={isSubmitting || uploadLoading}
                        >
                          {isSubmitting ? (
                            <>
                              <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                              儲存中...
                            </>
                          ) : (
                            <>
                              <i className="fas fa-save me-2"></i>
                              儲存變更
                            </>
                          )}
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              </div>

              <div className="text-muted small mt-2">
                註：系統標籤（tag）由平台評估指派，店家端不可編輯；若未獲得任何標籤則不顯示。
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileEdit;