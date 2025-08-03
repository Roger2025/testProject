var MongoClient = require('mongodb').MongoClient;

const client = new MongoClient("mongodb+srv://s1010606:wWJLH1Nlt7HdLh9y@cluster0.sfsk2g1.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0");

(async () => { 
  // Connect to the db
  await client.connect();
  //對應的DB資料夾
  const database  = client.db("Breakfast_Shop");
  //對應的表格
  const Person = database.collection("members");
  const result = await Person.updateOne(
    //要修改的對應欄位
    { _id:1 },
    //要修改的內容
    { $set:{name:'小柯'} },
    //要修改的筆數
    { w:1 },
  );

  console.log(`${result.matchedCount} document(s) matched the filter, updated ${result.modifiedCount} document(s)`,);

  await client.close(); // 關閉連線
})()
    .catch(err => console.error(err));


