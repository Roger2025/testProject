// 拿身分
function handleCheckMe(req, res) {
  console.log('檢查 session：', req.user);
  if (req.user) {
    res.json({ status: 'ok', user: req.user });
  } else {
    res.status(401).json({
       status: 'unauthorized',
       message: '未登入',
       adminVerified: req.session.adminVerified || false }); 
  }
}

module.exports = { handleCheckMe };
