var MongoClient = require('mongodb').MongoClient;

const client = new MongoClient("mongodb+srv://a127038349:7vPAQKYQts1RrN2O@cluster0.juevni4.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0");

(async () => { 
  // Connect to the db
  await client.connect();
  console.log("mongodb is running!");   
  await client.close(); // 關閉連線
})()
    .catch(err => console.error(err));

