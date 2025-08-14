// src/constants/devFlags.js
export const devFlags = {
  bypassAuth: false, // 開發模式繞過驗證
  mockUser: {
    merchantId: process.env.REACT_APP_DEFAULT_MERCHANT || '662f41ac1234567890abcde1',
    role: 'merchant',
    account: 'dev-merchant',
    name: '開發用商家',
    email: 'dev@merchant.local',
  },
};