const mongoose = require("mongoose");

const commentSchema = mongoose.Schema({
    user : {
        type : String,
        required : true,
        trim : true
    },
    password : {
        type : String,
        required : true
    },
    content : {
        type : String,
        required : true,
        trim : true  
    },
    postId : {
        type : String,
        required : true
    },
    createdAt : {
        type : Date,
        default : Date.now,
        required : true,
        unique : true
    }
});

module.exports = mongoose.model("Comments",commentSchema);