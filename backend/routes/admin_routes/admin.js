const express = require('express');
const router = express.Router();
const { roleCheck } = require('../../models/middlewares/roleCheck'); 
const {
  handleAdminOnlyData,
  handleCreateProduct,
  handleGetPendingUsers,
  handleApproveUser,
  handleGetAllUsers,
  handleDeleteUser,
  handleRestoreUser,
} = require('../../controllers/admin/adminController'); // 引入函式

//------------------------------------------------------------------------------------------管理者功能API路由設定

// 管理者專屬資料
router.get('/admin-only-data', roleCheck(['admin']), handleAdminOnlyData);

// 商家或管理者都能操作：新增商品（未來可補 req.body）
router.post('/create-product', roleCheck(['shop', 'admin']), handleCreateProduct);

// 查看待審核商家
router.get('/pending-users', roleCheck(['admin']), handleGetPendingUsers);

// 通過商家審核
router.patch('/approve-user/:account', roleCheck(['admin']), handleApproveUser);

// 取得所有使用者
router.get('/all-users', roleCheck(['admin']), handleGetAllUsers);

// 停權帳號（軟刪除）
router.delete('/delete-user/:account', roleCheck(['admin']), handleDeleteUser);

// 恢復帳號
router.patch('/restore-user/:account', roleCheck(['admin']), handleRestoreUser);

module.exports = router;
