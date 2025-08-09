// backend/controllers/homeOrderController.js
// 控制器 - 把資料從 DB 傳出去

const Order = require('../models/home/Order');
const { formatOrder } = require('../utils/orderFormatter');

// GET 查詢所有訂單 /api/home/order === root '/'
exports.getAllOrders = async (req, res) => {
  try {
    // const orders = await Order.find().sort({ order_date: -1 }); // 最新的在前
    // const orders = await Order.find().limit(50);
    // console.log('Fetched orders:', orders);
    // res.json(orders);
    // .sort({ order_date: -1 }) // 讓最新訂單在最前面
    // 用 lean() 讓資料是 plain object
    const orders = await Order.find().sort({ order_date: -1 }).lean(); 
    const formattedOrders = orders.map(formatOrder);
    console.log('Fetched formatted orders:', formattedOrders);
    res.json(formattedOrders);
  } catch (err) {
    console.error('[getAllOrders] DB 錯誤:', err);
    // res.status(500).json({ message: '無法取得訂單資料' });
    res.status(500).json({ error: err.message });
  }
};

// GET 查詢單筆訂單 /api/home/order/:order_id
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findOne({ order_id: req.params.order_id }).lean();
    if (!order) return res.status(404).json({ message: '訂單不存在' });

    const formatted = formatOrder(order);
    res.json(formatted);
  } catch (err) {
    console.error('[getOrderById] DB 錯誤:', err);
    // res.status(500).json({ message: '伺服器錯誤' });
    res.status(500).json({ error: err.message });
  }
};

// POST 建立新訂單 /api/home/order
// POST再訂一次 /api/home/order/:order_id/reorder 
exports.createOrder = async (req, res) => {
  try {
    const newOrder = new Order(req.body);
    await newOrder.save();
    res.status(201).json({ message: '訂單建立成功', order: newOrder });
  } catch (err) {
    console.error('[createOrder] DB 錯誤:', err);
    res.status(500).json({ message: '伺服器錯誤' });
  }
};

// PATCH 取消訂單 /api/home/order/:order_id/cancel
exports.cancelOrder = async (req, res) => {
  const { order_id } = req.params;
  console.log(`[cancelOrder] 收到取消請求: ${order_id}`);
  try {
    const order = await Order.findOne({ order_id });

    if (!order) {
      console.error(`[cancelOrder] 找不到訂單: ${order_id}`);
      return res.status(404).json({ message: '訂單不存在' });
    }

    // ❌ 不可取消的狀態
    const lockedStatuses = ['Cancelled', 'Closed'];
    if (lockedStatuses.includes(order.order_status)) {
      return res.status(400).json({ message: `訂單已為 ${order.order_status}，不可再取消` });
    }
    // ✅ 加上這段：更新訂單狀態
    order.order_status = 'Cancelled';
    // ✅ 可選：加上取消時間
    order.cancelled_at = new Date();
    await order.save();

    // res.json({ message: '訂單已取消', order });
    res.json({ message: '訂單已取消', order: formatOrder(order) });
  } catch (err) {
    console.error(`[cancelOrder] DB 錯誤:`, err);
    res.status(500).json({ message: '伺服器錯誤' });
  }
};




// 店家
// PATCH 更新已訂單 /api/merchant/order
exports.updateOrderStatus = async (req, res) => {
  const { order_id } = req.params;
  const { order_status } = req.body;

  try {
    const order = await Order.findOne({ order_id: order_id });

    if (!order) {
      console.error(`[updateOrderStatus] 找不到訂單: ${order_id}`);
      return res.status(404).json({ message: '訂單不存在' });
    }

    const allowedStatuses = ['Accepted', 'Completed', 'Closed'];
    if (!allowedStatuses.includes(order_status)) {
      return res.status(400).json({ message: '狀態不合法' });
    }

    newOrder.total_amount = req.body.content.reduce((sum, item) => {
    return sum + item.price * item.quantity;
    }, 0);

    // ❌ 不可變更的狀態
    const lockedStatuses = ['Cancelled', 'Closed'];
    if (lockedStatuses.includes(order.order_status)) {
      return res.status(400).json({ message: `訂單已為 ${order.order_status}，不可再變更狀態` });
    }

    order.order_status = order_status;
    await order.save();

    res.json({ message: `訂單狀態已更新為 ${order_status}`, order });
  } catch (err) {
    console.error('[updateOrderStatus] DB 錯誤:', err);
    res.status(500).json({ message: '伺服器錯誤' });
  }
};

// 店家
// DELETE 刪除訂單 /api/merchant/order/:order_id/delete
exports.deleteOrder = async (req, res) => {
  try {
    const result = await Order.deleteOne({ order_id: req.params.order_id });
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: '訂單不存在' });
    }
    res.json({ message: '訂單已刪除' });
  } catch (err) {
    console.error('[deleteOrder] DB 錯誤:', err);
    res.status(500).json({ message: '伺服器錯誤' });
  }
};
