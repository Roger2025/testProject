const express = require('express');
const bcrypt = require('bcryptjs');
const validator = require('validator');
const Member = require('../../server/models/member'); 
const Merchant = require('../../server/models/merchant'); 

// 再次判斷註冊並寫入資料庫 會員表 and 商家表
async function handleRegister(req, res) {
    console.log('🎯 Register API hit');
  const { account, password, email, phone, nickName, role, storeName, storeAddress } = req.body;
  console.log('✅ 收到註冊資料：', req.body); 
  try {
    // 檢查帳號是否存在
    const existingUser = await Member.findOne({ account });
    if (existingUser) {
      return res.json({ status: 'fail', message: '❌ 帳號已存在' });
    }

    // 檢查密碼格式
    const isValidPassword = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{6,20}$/;
    if (!isValidPassword.test(password)) {
      return res.json({ status: 'fail', message: '❌ 密碼需含英文與數字，長度 6～20 字元' });
    }

    // 檢查電話格式（台灣手機號碼）
    const isValidPhone = /^09\d{8}$/;
    if (!isValidPhone.test(phone)) {
      return res.json({ status: 'fail', message: '❌ 電話格式錯誤，請輸入 09 開頭共 10 碼數字' });
    }

    // Email 格式驗證
    if (!validator.isEmail(email)) {
      return res.json({ status: 'fail', message: '❌ Email 格式錯誤' });
    }

    // 加密密碼
    const hashedPassword = await bcrypt.hash(password, 10);

    let merchantId = '';
    const taiwanTime = new Date(Date.now() + 8 * 60 * 60 * 1000); // 台灣時間

    if (role === 'shop') {
      //merchantId = 'shop' + Date.now() + Math.floor(Math.random() * 10000); // 安全起見每次加亂數

      const newMerchant = await Merchant.create({
        //merchantId: merchantId,
        //merchantId: '',
        storeName,
        storeAddress,
        storePhone: phone,
        email,
        created_at: taiwanTime,
        name: account,
        phone,
      });

    merchantId = newMerchant._id.toString(); // 將原生_id物件轉字串
    await Merchant.updateOne({ _id: newMerchant._id }, { $set: { merchantId } }); // 找到newMerchant寫入merchantId

    }

    const newUser = new Member({
      account,
      password: hashedPassword,
      email,
      name: account, // 姓名同帳號
      role: role === 'user' ? 'user' : 'shop',
      status: role === 'user' ? 'active' : 'pending',
      storeName: role === 'shop' ? storeName : '',
      storeAddress: role === 'shop' ? storeAddress : '',
      merchantId: role === 'shop' ? merchantId : '',
      created_at: taiwanTime,
      phone,
      nickName,
  });
    newUser.member_id = newUser._id.toString();
    await newUser.save(); // 物件寫法要儲存 好處可以寫邏輯

    console.log('✅ 註冊成功:', account); 
    return res.json({ status: 'success', message: '✅ 註冊成功！請返回登入頁面' });

  } catch (err) {
    console.error('❌ 註冊失敗:', err.message, err.errors);
    return res.status(500).json({ status: 'fail', message: '❌ 註冊失敗，請稍後再試' });
  }
}

module.exports = { handleRegister };