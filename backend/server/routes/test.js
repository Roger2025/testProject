const express = require('express');
const router = express.Router();

// 測試用 API
router.get('/test', (req, res) => {
  res.json({ message: '前後端 API 連線成功！' });
});

module.exports = router;