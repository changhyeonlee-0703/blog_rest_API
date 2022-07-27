const express = require("express");
const mongoose = require("mongoose");
const { route } = require(".");
const router = express.Router();

const Posts=require("../schemas/post");

// 게시글 작성
router.post("/", async (req,res)=>{
    const {user, password, title, content}=req.body;
    const createdPost = await Posts.create({user, password, title, content, createdAt: new Date()});
    res.json({message : "게시글을 생성하였습니다."});
});


// 전체 게시글 조회
router.get("/",async (req,res)=>{
    const posts=await Posts.find();
    res.json({
        data : posts.map((post)=>({
            postId : post._id,
            user : post.user,
            title : post.title,
            createdAt : post.createdAt
        })),
    });
});


// 게시글 상세 조회
router.get("/:_postId", async (req, res)=>{
    const postId = req.params._postId;

    const [post]=await Posts.find({_id : postId});
    res.json({
        data : {
            postId : post._id,
            user : post.user,
            title : post.title,
            content : post.content,
            createdAt : post.createdAt
        } 
    })
});


// 게시글 수정
router.put("/:_postId", async (req, res)=>{
    const postId= req.params._postId;
    const {password, title, content} = req.body;

    const existsPost = await Posts.find({_id : postId});
    if(existsPost.length){
        await Posts.updateOne( {_id:postId},{$set : {password, title, content}} );
    }
    res.json({message : "게시글을 수정하였습니다."});
});


// 게시글 삭제
router.delete("/:_postId", async (req, res)=>{
    const postId=req.params._postId;
    const {password}=req.body;

    const [existsPost] = await Posts.find({_id:postId});
    if(existsPost.password===password){
        await Posts.deleteOne({_id:postId});
        res.json({message : "게시글을 삭제하였습니다."});
        return ;
    }
    else {
        res.json({message : "비밀번호가 일치하지 않습니다."});
        return ;
    }
});





module.exports = router;