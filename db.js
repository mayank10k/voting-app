const mongoose=require('mongoose');
require('dotenv').config();

// const mongoURL='mongodb://localhost:27017/voting'
const mongoURL=process.env.MONGODB_URL_LOCAL; 
mongoose.connect(mongoURL);
const db=mongoose.connection;

db.on('connected',()=>{
    console.log("connected to mongodb server");
})

db.on('error',(err)=>{
    console.log("mongodb error:",err);
})

db.on('disconnected',()=>{
    console.log("mongodb disconnected");
})

//export database connectionn
module.exports=db;   