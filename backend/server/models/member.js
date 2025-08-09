const mongoose = require('mongoose');

const memberSchema = new mongoose.Schema(
  {
    member_id: String,
    account: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: { type: String },
    nickName: { type: String, default: function () { return this.name; } },
    email: {
      type: String, required: true, unique: true,
      match: [/^\S+@\S+\.\S+$/, 'Email 格式不正確'],
    },
    phone: { type: String },
    created_at: {
      type: Date,
      default: () => {
        const now = new Date();
        now.setHours(now.getHours() + 8); // UTC+8
        return now;
      },
    },
    role: { type: String, default: 'user', enum: ['user', 'shop', 'admin'] },
    status: { type: String, enum: ['active', 'disabled', 'pending'] },
    storeName:   { type: String, required() { return this.role === 'shop'; } },
    storeAddress:{ type: String, required() { return this.role === 'shop'; } },
    merchantId:  { type: String },
    storeImage: { type: String, default: 'default_merchant/burger/burger2.jpg' }, // 改預設不然無法註冊
  },
  { collection: 'members' }
);

// 未填 status：shop=>pending，其餘=>active
memberSchema.pre('save', function (next) {
  if (!this.status) this.status = this.role === 'shop' ? 'pending' : 'active';
  next();
});

module.exports = mongoose.models.Member || mongoose.model('Member', memberSchema);
