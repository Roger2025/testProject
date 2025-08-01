var MongoClient = require('mongodb').MongoClient;

const client = new MongoClient("mongodb+srv://s1010606:wWJLH1Nlt7HdLh9y@cluster0.sfsk2g1.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0");

(async () => { 
  // Connect to the db
  await client.connect();
  const database  = client.db("Breakfast_Shop");
  const Person = database.collection("menu_items");
  
  const result = await Person.deleteOne( { _id: 121 }, { w: 1 }, );

  if (result.deletedCount === 1) {
    console.log("Successfully deleted one document.");
  } else {
    console.log("No documents matched the query. Deleted 0 documents.");
  }

  await client.close(); // 關閉連線
})()
    .catch(err => console.error(err));


