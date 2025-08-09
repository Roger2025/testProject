// backend/utils/orderFormatter.js
const { resolveImagePath } = require('./imageHelper');

function formatOrder(order) {
  if (!order || !Array.isArray(order.content)) return order;

  const fixedContent = order.content.map(item => ({
    ...item,
    img: resolveImagePath(item.img),
  }));

  return {
    ...order,
    content: fixedContent,
  };
}

module.exports = { formatOrder };