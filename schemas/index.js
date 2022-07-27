const mongoose = require("mongoose");
require("dotenv").config();

const connect = ()=>{
    mongoose
    .connect(process.env.mongoDB_URL, {ignoreUndefined :true})
    .catch((err)=>{console.error(err);});
};

module.exports=connect;