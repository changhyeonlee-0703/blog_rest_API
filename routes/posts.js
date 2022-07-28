const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const Posts=require("../schemas/post");



// 게시글 작성
router.post("/", async (req,res)=>{
    const {user, password, title, content}=req.body;
    
    if (!user){
        return res.status(400).json({success : false, errorMessage : "유저를 입력해주세요."});
    }else if(!title){
        return res.status(400).json({success : false, errorMessage : "타이틀을 입력해주세요."});
    }else if(!content){
        return res.status(400).json({success : false, errorMessage : "내용을 입력해주세요."});
    }else if(!password){
        return res.status(400).json({success : false, errorMessage : "비밀번호를 입력해주세요."});
    }
    const createdPost = await Posts.create({user, password, title, content});
    res.status(201).json({message : "게시글을 생성하였습니다."});
});



// 전체 게시글 조회
router.get("/",async (req,res)=>{
    const posts=await Posts.find({}).sort({createdAt:-1});
    if(!posts.length){ 
        return res.json({success:false, errorMessage : "게시글이 없습니다."});
    }
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

    const post=await Posts.findOne({_id : postId});
    if (!post){
        return res.json({success:false, errorMessage:"게시글이 없습니다."});
    }
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
    const existsPost = await Posts.findOne({_id : postId});

    if(!password){
        return res.status(400).json({success:false, errorMessage:"비밀번호를 입력해주세요."});
    }else if(!title){
        return res.status(400).json({success:false, errorMessage:"제목을 입력해주세요."});
    }else if(!content){
        return res.status(400).json({success:false, errorMessage:"내용을 입력해주세요."});
    }else if(password!==existsPost.password){
        return res.status(400).json({success:false, errorMessage:"비밀번호가 일치하지 않습니다."})
    }else{
        await Posts.updateOne( {_id:postId},{$set : {title, content}} );
        return res.status(200).json({success:true, Message : "수정이 완료되었습니다."})
    }  
});



// 게시글 삭제
router.delete("/:_postId", async (req, res)=>{
    const postId=req.params._postId;
    const {password}=req.body;

    const existsPost = await Posts.findOne({_id:postId});
    if(existsPost.password===password){
        await Posts.deleteOne({_id:postId});
        return res.status(200).json({message : "게시글을 삭제하였습니다."});
    }
    else {
        return res.status(400).json({success:false, message : "비밀번호가 일치하지 않습니다."}); 
    }
});




module.exports = router;