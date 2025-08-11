// 登出 清除session,cookie
function handleLogout(req, res) {
  req.session.destroy(err => {
    if (err) {
      return res.status(500).json({ status: 'error', message: '登出失敗' });
    }

    res.clearCookie('connect.sid');
    res.json({ status: 'success', message: ' 已成功登出' });
  });
}

module.exports = { handleLogout };
