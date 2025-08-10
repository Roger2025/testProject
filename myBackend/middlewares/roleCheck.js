function roleCheck(allowedRoles = []) {
  return (req, res, next) => {
    const user = req.user; // 這裡來自 session 中的使用者資訊（在主程式中已掛進 req.user）

    if (!user) {
      return res.status(401).json({ status: 'unauthorized', message: '❌ 尚未登入' });
    }

    if (allowedRoles.includes(user.role)) {
      return next(); // ✅ 放行
    } else {
      return res.status(403).json({ status: 'forbidden', message: '❌ 沒有權限訪問' });
    }
  };
}

module.exports = { roleCheck };
