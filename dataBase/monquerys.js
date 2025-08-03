const mongoose = require('mongoose');
const Todo = require('./model/Todo');


(async () => { 
    // Connect to the db
    await mongoose.connect('mongodb+srv://s1010606:wWJLH1Nlt7HdLh9y@cluster0.sfsk2g1.mongodb.net/Breakfast_Shop?retryWrites=true&w=majority&appName=Cluster0');
    console.log("mongodb is running!");
    //查全部   
    //const todos =  await Todo.find().select('-__v -_id');
    //查對應ID的資料
    const todos =  await Todo.find({location_id:2}).select('-__v');
    console.log(todos);   
  })()
      .catch(err => console.error(err));


