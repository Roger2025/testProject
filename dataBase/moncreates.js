const mongoose = require('mongoose');
const insertOne = require('./utils/insone');

// mongoose.connect('mongodb+srv://s1010606:wWJLH1Nlt7HdLh9y@cluster0.sfsk2g1.mongodb.net/Breakfast_Shop?retryWrites=true&w=majority&appName=Cluster0');
// console.log("mongodb is running!");   

(async () => {
  try {
    await mongoose.connect('mongodb+srv://s1010606:wWJLH1Nlt7HdLh9y@cluster0.sfsk2g1.mongodb.net/Breakfast_Shop?retryWrites=true&w=majority&appName=Cluster0');
    console.log('✅ DB connected');

    const result = await insertOne('user', {
      account:'66599607',
      password:'85695678',
      email:'af9sd56f@gamil.com',
    });

    if (result.success) {
      console.log('✅ 建立成功:', result.data);
    } else {
      console.error('❌ 建立失敗:', result.error);
    }

    process.exit();
  } catch (err) {
    console.error('❌ 發生錯誤:', err);
    process.exit(1);
  }
})();

  




