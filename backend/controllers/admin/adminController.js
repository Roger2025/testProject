const Member = require('../../models/Register_Schema/member');
const { roleCheck } = require('../../models/middlewares/roleCheck'); // 如果 controller 用不到可略去

async function handleAdminOnlyData(req, res) {
  res.json({
    status: 'success',
    message: '這是管理者專屬資料',
    user: req.user
  });
}

async function handleCreateProduct(req, res) {
  res.json({
    status: 'success',
    message: '新增商品成功',
    by: req.user?.role || 'unknown'
  });
}

//----------------------------------------------------------------------------------------------------------審核區塊

// 取得pending商家
async function handleGetPendingUsers(req, res) {
  try {
    const pendingShops = await Member.find(
      { status: 'pending' },
      {
        account: 1,
        email: 1,
        role: 1,
        status: 1,
        created_at: 1,
        storeName: 1,
        storeAddress: 1,
        _id: 0,              // 不傳_id
      }
    ).lean(); // 回普通 JS 物件 省記憶體 查詢更快

    res.json({ status: 'success', pendingShops });
  } catch (err) {
    res.status(500).json({ status: 'error', message: '伺服器錯誤' });
  }
}

// 審核通過功能
async function handleApproveUser(req, res) {
  const targetAccount = req.params.account;
  try {
    const user = await Member.findOne({ account: targetAccount });
    console.log('🟡 要審核帳號:', user?.account);
    console.log('🟡 原始狀態:', user?.status);

    if (!user) {
      return res.status(404).json({ status: 'fail', message: '找不到此帳號' });
    }
    if (user.status !== 'pending') {
      return res.json({ status: 'fail', message: '該帳號不在審核狀態' });
    }
    user.status = 'active';
    console.log('✅ 審核成功:', targetAccount);
    console.log('✅ 狀態改為:', user.status);
    await user.save();

    res.json({
      status: 'success',
      message: `✅ 帳號 ${targetAccount} 已審核通過並設為 shop`,
      //user 
    });
  } catch (err) {
    console.error('❌ 審核失敗錯誤：', err);
    res.status(500).json({ status: 'error', message: '伺服器錯誤', error: err.message });
  }
}

//----------------------------------------------------------------------------------------------------------取得使用者區塊

// 取得所有使用者資料 (商家,消費者,管理者)
async function handleGetAllUsers(req, res) {
  try {
    const users = await Member.find(
      {},
      {
        account: 1,
        email: 1,
        role: 1,
        status: 1,
        created_at: 1,
        storeName: 1,
        storeAddress: 1,
        _id: 0,              // 不傳_id
      }
    ).lean();
    res.json({ status: 'success', users });
  } catch (err) {
    res.status(500).json({ status: 'error', message: '伺服器錯誤' });
  }
}

//----------------------------------------------------------------------------------------------------------停權+恢復帳號區塊

// 停權功能
async function handleDeleteUser(req, res) {
  const target = req.params.account;
  try {
    const user = await Member.findOne({ account: target });
    console.log('🟡 要停權帳號:', user?.account);
    console.log('🟡 原始狀態:', user?.status);

    if (!user) {
      return res.status(404).json({ status: 'fail', message: '找不到使用者' });
    }
    if (user.role === 'admin') {
      return res.status(403).json({ status: 'fail', message: '❌ 不能停權管理者帳號' });
    }
    const result = await Member.updateOne({ account: target }, { $set: { status: 'disabled' } });
    if (result.matchedCount === 0) {
      return res.status(404).json({ status: 'fail', message: '找不到該帳號，無法更新' });
    }
    if (result.modifiedCount === 0) {
      return res.json({ status: 'info', message: '此帳號已是停權狀態，無需再次更新' });
    }
    console.log('✅ 停權成功:', target);
    console.log('✅ 狀態改為:', 'disabled');
    res.json({ status: 'success', message: `✅ 帳號 ${target} 已被停權` });
  } catch (err) {
    console.error('❌ 停權時錯誤:', err);
    res.status(500).json({ status: 'error', message: '伺服器錯誤' });
  }
}

// 恢復帳號功能
async function handleRestoreUser(req, res) {
  const target = req.params.account;
  try {
    const user = await Member.findOne({ account: target });
    console.log('🟡 要恢復帳號:', target);
    console.log('🟡 原始狀態:', user?.status);

    if (!user) {
      return res.status(404).json({ status: 'fail', message: '找不到此帳號' });
    }
    if (user.status !== 'disabled') {
      return res.json({ status: 'fail', message: '該帳號未被停權，無需恢復' });
    }
    const result = await Member.updateOne({ account: target }, { $set: { status: 'active' } });
    if (result.modifiedCount === 1) {
      console.log('✅ 恢復成功:', target);
      console.log('✅ 狀態改為:', 'active');
      res.json({ status: 'success', message: `✅ 帳號 ${target} 已恢復使用權限` });
    } else {
      res.status(400).json({ status: 'fail', message: '未成功更新帳號狀態' });
    }
  } catch (err) {
    console.error('❌ 恢復帳號時發生錯誤:', err);
    res.status(500).json({ status: 'error', message: '伺服器錯誤' });
  }
}

// 函式匯出
module.exports = {
  handleAdminOnlyData,
  handleCreateProduct,
  handleGetPendingUsers,
  handleApproveUser,
  handleGetAllUsers,
  handleDeleteUser,
  handleRestoreUser,
};