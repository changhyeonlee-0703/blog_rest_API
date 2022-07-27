const express = require("express");
const Comments = require("../schemas/comment")
const router = express.Router();



// 댓글 생성
router.post("/:_postId", async (req, res)=>{
    const postId = req.params._postId;
    const {user, password, content}=req.body;

    if(!user){return res.status(400).json({success:false, errorMessage:"이름을 입력해주세요."});}
    else if(!content){return res.status(400).json({success:false, errorMessage:"내용을 입력해주세요."});}
    else if(!password){return res.status(400).json({success:false, errorMessage:"비밀번호를 입력해주세요."});}
    else {
        const createdPost = await Comments.create({user, password, content, postId : postId});
        return res.status(201).json({message : "댓글을 생성하였습니다."});
    }
});



// 댓글 목록 조회
router.get("/:_postId", async (req, res)=>{
    const postId=req.params._postId;

    const comments = await Comments.find({postId}).sort({createdAt:-1});
    res.json({
        data : comments.map((comment)=>({
            commentId : comment._id,
            user : comment.user,
            content : comment.content,
            createdAt : comment.createdAt
        }))
    });
});



// 댓글 수정
router.put("/:_commentId", async (req, res)=>{
    const commentId=req.params._commentId;
    const {password, content} = req.body;

    const existsComment = await Comments.findOne({_id:commentId});
    
    if(!existsComment){return res.status(400).json({success:false,errorMessage:"댓글이 없습니다."})}
    else if(!content){return res.status(400).json({success:false, errorMessage:"내용을 입력해주세요."});}
    else if(!password){return res.status(400).json({success:false, errorMessage:"비밀번호를 입력해주세요."});}
    else if(password!==existsComment.password){return res.status(400).json({success:false, errorMessage:"비밀번호가 틀립니다."});}
    else{
        await Comments.updateOne( {_id:commentId},{$set : {content}} );
        return res.json({message : "댓글을 수정하였습니다."});
    }   
});



// 댓글 삭제
router.delete("/:_commentId", async (req, res)=>{
    const commentId=req.params._commentId;
    const {password}=req.body;

    const existsComment = await Comments.findOne({_id:commentId});
    if(!existsComment){return res.status(400).json({success : false, errorMessage : "댓글이 없습니다."});}
    else if(existsComment.password!==password){return res.status(400).json({success : false, errorMessage : "비밀번호가 일치하지 않습니다."});}
    else{
        await Comments.deleteOne({_id:commentId});
        return res.json({success : true, message : "게시글을 삭제하였습니다."});
    }
});



module.exports = router;