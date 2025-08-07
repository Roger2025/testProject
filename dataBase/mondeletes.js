var MongoClient = require('mongodb').MongoClient;

const client = new MongoClient("mongodb+srv://s1010606:wWJLH1Nlt7HdLh9y@cluster0.sfsk2g1.mongodb.net/Breakfast_Shop?retryWrites=true&w=majority&appName=Cluster0");

(async () => { 
  // Connect to the db
  await client.connect();
  //對應的DB資料夾
  const database  = client.db("Breakfast_Shop");
  //對應的表格
  const Person = database.collection("members");
  

  //要刪除的對應欄位與筆數
  const result = await Person.deleteOne( { id: 2 }, { w: 1 }, );

  if (result.deletedCount === 1) {
    console.log("Successfully deleted one document.");
  } else {
    console.log("No documents matched the query. Deleted 0 documents.");
  }

  await client.close(); // 關閉連線
})()
    .catch(err => console.error(err));


