const mongoose = require("mongoose");

mongoConnString = "mongodb+srv://alanjch1990:1DhkGbynTCDYIdFx@cluster0.atruc2l.mongodb.net/"
mongoConnString2 = "mongodb+srv://s1010606:wWJLH1Nlt7HdLh9y@cluster0.sfsk2g1.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"

try{
    mongoose.connect(mongoConnString2).then(()=>console.log("mongoDB連線成功"))
}catch(error){
    console.error("mongoDB連線失敗:", error.message)
}
