const mongoose = require('mongoose');
const faker = require('faker'); // 用來產假資料（要先安裝）

const Member = require('./models/member'); // 請確認路徑正確

(async () => {
  try {
    await mongoose.connect('mongodb+srv://s1010606:wWJLH1Nlt7HdLh9y@cluster0.sfsk2g1.mongodb.net/Breakfast_Shop?retryWrites=true&w=majority&appName=Cluster0');
    console.log('✅ DB connected');

    // 產生 5 筆資料
    for (let i = 1; i <= 5; i++) {
      const member = new Member({
        account: `shopuser${i}`,
        password: `A123456${i}`,
        status: 'pending',
        phone: faker.phone.phoneNumber('09########'),
        storeName: faker.company.companyName(),
        address: faker.address.city() + faker.address.streetName(),
        email: `shopuser${i}@test.com`,
        name: faker.name.findName(),
        role: 'shop',
      });

      const saved = await member.save();
      console.log(`✅ 第 ${i} 筆建立成功：`, saved.account);
    }

    process.exit();
  } catch (err) {
    console.error('❌ 發生錯誤:', err);
    process.exit(1);
  }
})();



//   .then(async () => {
//     console.log('✅ DB connected');

//     const result = await insertOne('members', {
//       account:'test10',
//       password:'B227033999',
//       email:'B227797999@gmail.com'
//     });

//     if (result.success) {
//       console.log('✅ 建立成功:', result.data);
//     } else {
//       console.error('❌ 建立失敗:', result.error);
//     }

//     process.exit();
// });
  




