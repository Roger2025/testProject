var MongoClient = require('mongodb').MongoClient;

const client = new MongoClient("mongodb+srv://s1010606:wWJLH1Nlt7HdLh9y@cluster0.sfsk2g1.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0");

(async () => { 
  // Connect to the db
  await client.connect();
  const database  = client.db("Breakfast_Shop");
  const Person = database.collection("menu_items");
  await Person.insertOne({ _id: 122,menu_items_id:122, name:'測試1',description:'',price:'50',is_available:true,menu_photo:'',menu_categories_id:'9',location_id:'1'});

  await client.close(); // 關閉連線
})()
    .catch(err => console.error(err));


