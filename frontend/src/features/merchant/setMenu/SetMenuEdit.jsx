// features/merchant/setMenu/SetMenuEdit.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { addSetMenu, updateSetMenu } from './merchantSetMenuSlice';
import { Button, Form, Container, Row, Col, Card } from 'react-bootstrap';

const SetMenuEdit = ({ merchantId }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // 判斷是否為編輯模式
  const isEditMode = location.pathname.includes('/edit');
  const data = useMemo(() => location.state || {}, [location.state]);

  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    imageUrl: '',
    available: true,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // 當處於編輯模式並有資料時，初始化表單
  useEffect(() => {
    if (isEditMode && data._id) {
      setForm({
        name: data.name || '',
        description: data.description || '',
        price: data.price || '',
        imageUrl: data.imageUrl || '',
        available: data.available ?? true,
      });
    }
  }, [isEditMode, data]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const payload = {
        ...form,
        merchantId: "60f1b2e3c4d5e6f7a8b9c0d1", // 測試用 merchantId
        price: Number(form.price) || 0, // 防呆：確保是數字
        imageUrl: form.imageUrl || undefined,
        items: [
          {
            menuId: "68863ddaec2c6428b4a6edc3", // 用你剛新增成功的 menu ID
            quantity: 1,
            note: "測試用餐點"
          }
        ] // 暫時給測試資料
      };

      if (isEditMode && data._id) {
        await dispatch(updateSetMenu({ id: data._id, data: payload }));
      } else {
        await dispatch(addSetMenu(payload));
      }

      // 成功後導航回菜單頁面
      navigate('/merchant/menu');
    } catch (error) {
      console.error('提交失敗:', error);
      // 這裡可以加入錯誤處理 UI
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate('/merchant/menu');
  };

  return (
    <Container className="py-4">
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <Card className="shadow-sm">
            <Card.Header className="bg-success text-white">
              <h4 className="mb-0">
                {isEditMode ? '編輯套餐' : '新增套餐'}
              </h4>
            </Card.Header>
            <Card.Body>
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>套餐名稱 <span className="text-danger">*</span></Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="請輸入套餐名稱"
                    required
                    disabled={isSubmitting}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>套餐描述</Form.Label>
                  <Form.Control
                    as="textarea"
                    name="description"
                    rows={3}
                    value={form.description}
                    onChange={handleChange}
                    placeholder="套餐內容描述（選填）"
                    disabled={isSubmitting}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>套餐價格（元） <span className="text-danger">*</span></Form.Label>
                  <Form.Control
                    type="number"
                    name="price"
                    min="0"
                    step="1"
                    value={form.price}
                    onChange={handleChange}
                    placeholder="0"
                    required
                    disabled={isSubmitting}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>套餐圖片連結</Form.Label>
                  <Form.Control
                    type="url"
                    name="imageUrl"
                    value={form.imageUrl}
                    onChange={handleChange}
                    placeholder="https://example.com/setmenu-image.jpg"
                    disabled={isSubmitting}
                  />
                  {form.imageUrl && (
                    <div className="mt-2">
                      <img
                        src={form.imageUrl}
                        alt="套餐預覽"
                        className="img-thumbnail"
                        style={{ maxWidth: '200px', maxHeight: '150px' }}
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Check
                    type="checkbox"
                    name="available"
                    label="是否上架販售"
                    checked={form.available}
                    onChange={handleChange}
                    disabled={isSubmitting}
                  />
                </Form.Group>

                <div className="d-flex justify-content-end gap-2">
                  <Button 
                    variant="outline-secondary" 
                    onClick={handleCancel}
                    disabled={isSubmitting}
                  >
                    取消
                  </Button>
                  <Button 
                    variant="success" 
                    type="submit"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        {isEditMode ? '儲存中...' : '新增中...'}
                      </>
                    ) : (
                      isEditMode ? '儲存變更' : '新增套餐'
                    )}
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default SetMenuEdit;