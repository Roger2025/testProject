var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  // res.render('index', { title: 'Express' });
  res.send('<h1>✅ MongoDB 已連線成功 II！</h1>');
});

module.exports = router;
