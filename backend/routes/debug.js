// routes/debug.js
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Merchant = require('../models/merchant/Todo_merchant');

router.get('/dbinfo', (req, res) => {
  const conn = mongoose.connection;
  res.json({
    host: conn.host,
    port: conn.port,
    dbName: conn.name,
    readyState: conn.readyState, // 1=connected
  });
});

router.get('/merchant/:merchantId', async (req, res) => {
  const { merchantId } = req.params;
  const doc = await Merchant.findOne({ merchantId })
    .select('merchantId Business.updatedAt Business.lastModified Business.schedule');
  const count = await Merchant.countDocuments({ merchantId });
  res.json({ count, doc });
});

module.exports = router;