const mongoose = require('mongoose');
const Todo = require('./model/Todo');

(async () => { 
    // Connect to the db
    await mongoose.connect('mongodb+srv://s1010606:wWJLH1Nlt7HdLh9y@cluster0.sfsk2g1.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0');
    // console.log("mongodb is running!");   
    const todos =  await Todo.find();
    // const todos =  await Todo.find().select('-__v -_id');
    console.log(todos);   
  })()
      .catch(err => console.error(err));


