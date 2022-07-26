const mongoose = require("mongoose");

const commentSchema = mongoose.Schema({
    user : {
        type : String
    },
    password : {
        type : String
    },
    content : {
        type : String
    },
    postId : {
        type : String
    },
    createdAt : {
        type : String
    }
});

module.exports = mongoose.model("Comments",commentSchema);