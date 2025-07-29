//src/features/merchant/setMenu/SetMenuList.jsx
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMerchantSetMenus, deleteSetMenu, toggleSetMenuStatus } from './merchantSetMenuSlice';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Table, Button, Badge, Alert, Modal, Spinner as BootstrapSpinner } from 'react-bootstrap';
import '../../../styles/style.css';

const SetMenuList = ({ merchantId }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { setMenus, loading, error } = useSelector((state) => state.merchantSetMenu);
  
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedSetMenu, setSelectedSetMenu] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (merchantId) {
      dispatch(fetchMerchantSetMenus(merchantId));
    }
  }, [dispatch, merchantId]);

  const handleEdit = (setMenu) => {
    navigate(`/merchant/set-menus/edit/${setMenu._id}`, { state: setMenu });
  };

  const handleAddNew = () => {
    navigate('/merchant/set-menus/new');
  };

  const handleDeleteClick = (setMenu) => {
    setSelectedSetMenu(setMenu);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (selectedSetMenu) {
      setIsDeleting(true);
      try {
        await dispatch(deleteSetMenu(selectedSetMenu._id));
        setShowDeleteModal(false);
        setSelectedSetMenu(null);
      } catch (error) {
        console.error('刪除失敗:', error);
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const handleToggleStatus = async (setMenu) => {
    try {
      await dispatch(toggleSetMenuStatus({ 
        id: setMenu._id, 
        available: !setMenu.available 
      }));
    } catch (error) {
      console.error('狀態更新失敗:', error);
    }
  };

  const handleCloseModal = () => {
    if (!isDeleting) {
      setShowDeleteModal(false);
      setSelectedSetMenu(null);
    }
  };

  if (loading) {
    return (
      <Container className="py-4 text-center">
        <BootstrapSpinner animation="border" variant="success" />
        <p className="mt-2">載入套餐資料中...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-4">
        <Alert variant="danger">
          <Alert.Heading>載入失敗</Alert.Heading>
          <p>錯誤訊息：{error}</p>
          <Button variant="outline-danger" onClick={() => window.location.reload()}>
            重新載入
          </Button>
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <h2 className="mb-0">我的套餐列表</h2>
            <Button variant="success" onClick={handleAddNew}>
              <i className="bi bi-plus-circle me-2"></i>
              新增套餐
            </Button>
          </div>
        </Col>
      </Row>

      {setMenus.length === 0 ? (
        <Row>
          <Col>
            <Alert variant="info" className="text-center">
              <Alert.Heading>尚無套餐資料</Alert.Heading>
              <p>您還沒有新增任何套餐，立即開始建立您的套餐組合吧！</p>
              <Button variant="success" onClick={handleAddNew}>
                新增第一個套餐
              </Button>
            </Alert>
          </Col>
        </Row>
      ) : (
        <Row>
          <Col>
            <div className="table-responsive">
              <Table striped bordered hover className="align-middle">
                <thead className="table-success">
                  <tr>
                    <th style={{ width: '100px' }}>圖片</th>
                    <th>套餐名稱</th>
                    <th>套餐描述</th>
                    <th style={{ width: '100px' }}>價格</th>
                    <th style={{ width: '100px' }}>狀態</th>
                    <th style={{ width: '200px' }}>操作</th>
                  </tr>
                </thead>
                <tbody>
                  {setMenus.map((setMenu) => (
                    <tr key={setMenu._id}>
                      <td className="text-center">
                        {setMenu.imageUrl ? (
                          <img
                            src={setMenu.imageUrl}
                            alt={setMenu.name}
                            className="img-thumbnail"
                            style={{ width: '80px', height: '80px', objectFit: 'cover' }}
                            onError={(e) => {
                              e.target.src = '/placeholder-setmenu.jpg'; // 可替換為預設圖片
                            }}
                          />
                        ) : (
                          <div className="bg-light d-flex align-items-center justify-content-center" 
                               style={{ width: '80px', height: '80px', borderRadius: '4px' }}>
                            <i className="bi bi-collection text-muted"></i>
                            <span className="text-muted small">無圖片</span>
                          </div>
                        )}
                      </td>
                      <td>
                        <strong>{setMenu.name}</strong>
                      </td>
                      <td>
                        <span className="text-muted">
                          {setMenu.description || '無描述'}
                        </span>
                      </td>
                      <td className="text-end">
                        <strong>NT$ {setMenu.price}</strong>
                      </td>
                      <td className="text-center">
                        <Badge 
                          bg={setMenu.available ? 'success' : 'secondary'}
                          style={{ cursor: 'pointer' }}
                          onClick={() => handleToggleStatus(setMenu)}
                          title="點擊切換狀態"
                        >
                          {setMenu.available ? '上架中' : '已下架'}
                        </Badge>
                      </td>
                      <td>
                        <div className="d-flex gap-2">
                          <Button 
                            variant="outline-success" 
                            size="sm"
                            onClick={() => handleEdit(setMenu)}
                          >
                            <i className="bi bi-pencil me-1"></i>
                            編輯
                          </Button>
                          <Button 
                            variant="outline-danger" 
                            size="sm"
                            onClick={() => handleDeleteClick(setMenu)}
                          >
                            <i className="bi bi-trash me-1"></i>
                            刪除
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          </Col>
        </Row>
      )}

      {/* 刪除確認對話框 */}
      <Modal show={showDeleteModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton={!isDeleting}>
          <Modal.Title>確認刪除</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedSetMenu && (
            <p>
              確定要刪除套餐「<strong>{selectedSetMenu.name}</strong>」嗎？
              <br />
              <small className="text-muted">此操作無法復原。</small>
            </p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button 
            variant="secondary" 
            onClick={handleCloseModal}
            disabled={isDeleting}
          >
            取消
          </Button>
          <Button 
            variant="danger" 
            onClick={handleDeleteConfirm}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <>
                <BootstrapSpinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                  className="me-2"
                />
                刪除中...
              </>
            ) : (
              '確認刪除'
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default SetMenuList;