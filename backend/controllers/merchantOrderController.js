const Order = require('../models/order/Todo_order');
const mongoose = require('mongoose');

const merchantOrderController = {

    // 今日訂單列表（根據 merchantId）
    getTodayOrders: async (req, res) => {
        try {
            const { merchantId } = req.params;

            const startOfDay = new Date();
            startOfDay.setHours(0, 0, 0, 0);
            const endOfDay = new Date();
            endOfDay.setHours(23, 59, 59, 999);

            const todayOrders = await Order.find({
            merchantId,
            order_date: { $gte: startOfDay, $lte: endOfDay }
            }).sort({ order_date: -1 });

            res.json({ success: true, data: todayOrders });
        } catch (error) {
            console.error('getTodayOrders Error:', error);
            res.status(500).json({ success: false, message: '取得今日訂單失敗' });
        }
    },

  // 單一訂單詳情
  getOrderById: async (req, res) => {
    try {
      const { orderId } = req.params;
      const order = await Order.findOne({ order_id: orderId });

      if (!order) {
        return res.status(404).json({ success: false, message: '訂單不存在' });
      }

      res.json({ success: true, data: order });
    } catch (error) {
      console.error('getOrderById Error:', error);
      res.status(500).json({ success: false, message: '取得訂單失敗' });
    }
  },

  // 指定狀態的訂單列表
  getOrdersByStatus: async (req, res) => {
    try {
      const { status, merchantId } = req.params;

      const orders = await Order.find({
        merchantId,
        order_status: status
      }).sort({ order_date: -1 });

      res.json({ success: true, data: orders });
    } catch (error) {
      console.error('getOrdersByStatus Error:', error);
      res.status(500).json({ success: false, message: '取得訂單失敗' });
    }
  },

  // 日期區間訂單列表
  getOrdersByDateRange: async (req, res) => {
    try {
      const { merchantId } = req.params;
      const { startDate, endDate } = req.query;

      if (!startDate || !endDate) {
        return res.status(400).json({ success: false, message: '請提供開始與結束日期' });
      }

      const start = new Date(startDate);
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);

      const orders = await Order.find({
        merchantId,
        order_date: { $gte: start, $lte: end }
      }).sort({ order_date: -1 });

      res.json({ success: true, data: orders });
    } catch (error) {
      console.error('getOrdersByDateRange Error:', error);
      res.status(500).json({ success: false, message: '取得訂單失敗' });
    }
  },

  // 訂單統計（指定日或今天）
  getOrderStats: async (req, res) => {
    try {
      const { merchantId } = req.params;
      const { date } = req.query;

      const target = date ? new Date(date) : new Date();
      const start = new Date(target.setHours(0, 0, 0, 0));
      const end = new Date(target.setHours(23, 59, 59, 999));

      const stats = await Order.aggregate([
        {
          $match: {
            merchantId,
            order_date: { $gte: start, $lte: end }
          }
        },
        {
          $group: {
            _id: '$order_status',
            count: { $sum: 1 },
            totalAmount: { $sum: '$total_amount' }
          }
        }
      ]);

      const result = {
        totalOrders: stats.reduce((acc, cur) => acc + cur.count, 0),
        totalAmount: stats.reduce((acc, cur) => acc + cur.totalAmount, 0),
        breakdown: stats.reduce((acc, cur) => {
          acc[cur._id] = cur.count;
          return acc;
        }, {})
      };

      res.json({ success: true, data: result });
    } catch (error) {
      console.error('getOrderStats Error:', error);
      res.status(500).json({ success: false, message: '取得統計資料失敗' });
    }
  },

  // 更新訂單狀態
  updateOrderStatus: async (req, res) => {
    try {
      const { orderId } = req.params;
      const { status, merchantId } = req.body;

      const updated = await Order.findOneAndUpdate(
        { order_id: orderId, merchantId },
        { order_status: status },
        { new: true }
      );

      if (!updated) {
        return res.status(404).json({ success: false, message: '訂單不存在或權限不足' });
      }

      res.json({ success: true, message: '訂單狀態更新成功', data: updated });
    } catch (error) {
      console.error('updateOrderStatus Error:', error);
      res.status(500).json({ success: false, message: '更新訂單狀態失敗' });
    }
  },

  // 批次更新訂單狀態
  batchUpdateOrderStatus: async (req, res) => {
    try {
      const { orderIds, status, merchantId } = req.body;

      const result = await Order.updateMany(
        {
          order_id: { $in: orderIds },
          merchantId
        },
        { order_status: status }
      );

      res.json({
        success: true,
        message: `成功更新 ${result.modifiedCount} 筆訂單`,
        data: result
      });
    } catch (error) {
      console.error('batchUpdateOrderStatus Error:', error);
      res.status(500).json({ success: false, message: '批次更新失敗' });
    }
  }
};

module.exports = merchantOrderController;