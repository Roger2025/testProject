//產生雜湊值
const bcrypt = require('bcryptjs');

const plainPassword = 'A127038349';

bcrypt.hash(plainPassword, 10).then(hash => {
  console.log('雜湊值是：', hash);
});