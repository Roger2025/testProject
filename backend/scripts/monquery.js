const mongoose = require('mongoose');
const Todo = require('../model/Todo');

(async () => { 
    // Connect to the db
    await mongoose.connect('mongodb+srv://fcaibi:uMVt4Arnr1jLONN9@cluster0.v1bwy.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0');
    // console.log("mongodb is running!");   
    const todos =  await Todo.find();
    // const todos =  await Todo.find().select('-__v -_id');
    console.log(todos);   
  })()
      .catch(err => console.error(err));


