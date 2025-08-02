const express = require('express');
const router = express.Router();
const { roleCheck } = require('../../middlewares/roleCheck'); 
const Member = require('../../models/member'); // ✅ 引入真實資料表

// ✅ 管理者專屬資料
router.get('/admin-only-data', roleCheck(['admin']), (req, res) => {
  res.json({
    status: 'success',
    message: '這是管理者專屬資料',
    user: req.user
  });
});

// ✅ 商家或管理者都能操作：新增商品（未來可補 req.body）
router.post('/create-product', roleCheck(['shop', 'admin']), (req, res) => {
  res.json({
    status: 'success',
    message: '新增商品成功',
    by: req.user?.role || 'unknown'
  });
});

//  查看待審核商家
router.get('/pending-users', roleCheck(['admin']), async (req, res) => {
  try {
    const pendingShops = await Member.find({ status: 'pending' });
    res.json({ status: 'success', pendingShops: pendingShops });
  } catch (err) {
    res.status(500).json({ status: 'error', message: '伺服器錯誤' });
  }
});

// 通過商家審核
router.patch('/approve-user/:account', roleCheck(['admin']), async (req, res) => {
  const targetAccount = req.params.account;
  try {
    const user = await Member.findOne({ account: targetAccount });

    if (!user) {
      return res.status(404).json({ status: 'fail', message: '找不到此帳號' });
    }

    if (user.status !== 'pending') {
      return res.json({ status: 'fail', message: '該帳號不在審核狀態' });
    }

    user.status = 'active';
    await user.save();

    res.json({
      status: 'success',
      message: `✅ 帳號 ${targetAccount} 已審核通過並設為 shop`,
      user
    });
  } catch (err) {
    console.error('❌ 審核失敗錯誤：', err); // ✅ 這行現在安全了
    res.status(500).json({
      status: 'error',
      message: '伺服器錯誤',
      error: err.message
    });
  }
});



// ✅ 取得所有使用者
router.get('/all-users', roleCheck(['admin']), async (req, res) => {
  try {
    const users = await Member.find();
    res.json({ status: 'success', users });
  } catch (err) {
    res.status(500).json({ status: 'error', message: '伺服器錯誤' });
  }
});

// ✅ 停權帳號（軟刪除）
router.delete('/delete-user/:account', roleCheck(['admin']), async (req, res) => {
  const target = req.params.account;

  try {
    const user = await Member.findOne({ account: target });
    console.log('🟡 查詢帳號:', user?.account);
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
    res.json({ status: 'success', message: `✅ 帳號 ${target} 已被停權` });

  } catch (err) {
    console.error('❌ 停權時錯誤:', err);
    res.status(500).json({ status: 'error', message: '伺服器錯誤' });
  }
});



// ✅ 恢復帳號
router.patch('/restore-user/:account', roleCheck(['admin']), async (req, res) => {
  const target = req.params.account;

  try {
    const user = await Member.findOne({ account: target });

    if (!user) {
      return res.status(404).json({ status: 'fail', message: '找不到此帳號' });
    }

    if (user.status !== 'disabled') {
      return res.json({ status: 'fail', message: '該帳號未被停權，無需恢復' });
    }

    const result = await Member.updateOne({ account: target }, { $set: { status: 'active' } });

    if (result.modifiedCount === 1) {
      console.log('✅ 恢復成功:', target);
      res.json({
        status: 'success',
        message: `✅ 帳號 ${target} 已恢復使用權限`
      });
    } else {
      res.status(400).json({ status: 'fail', message: '未成功更新帳號狀態' });
    }
  } catch (err) {
    console.error('❌ 恢復帳號時發生錯誤:', err);
    res.status(500).json({ status: 'error', message: '伺服器錯誤' });
  }
});


module.exports = router;
