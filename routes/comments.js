const express = require("express");
const Comments = require("../schemas/comment")
const router = express.Router();


// 댓글 생성
router.post("/:_postId", async (req, res)=>{
    const postId = req.params._postId;
    const {user, password, content}=req.body;

    if(content!==""){
        const createdPost = await Comments.create({user, password, content, postId : postId, createdAt: new Date()});
        res.status(201).json({message : "댓글을 생성하였습니다."});
        return ;
    }
    else{
        res.json({message : "댓글 내용을 입력해 주세요."})
    }

});


// 댓글 목록 조회
router.get("/:_postId", async (req, res)=>{
    const postId=req.params._postId;

    const comments = await Comments.find({postId});
    res.json({
        data : comments.map((comment)=>({
            commentId : comment._id,
            user : comment.user,
            content : comment.content,
            createdAt : comment.createdAt
        })).reverse()
    });
});


// 댓글 수정
router.put("/:_commentId", async (req, res)=>{
    const commentId=req.params._commentId;
    const {password, content} = req.body;

    const [existsComment] = await Comments.find({_id:commentId});
    if([existsComment].length && content!=="" && existsComment.password===password){
        await Comments.updateOne( {_id:commentId},{$set : {content}} );
        res.json({message : "댓글을 수정하였습니다."});
        return ;
    }
    else {
        res.json({message : "비밀번호가 틀리거나 댓글 내용이 없습니다."});
        return ;
    }
    
});


// 댓글 삭제
router.delete("/:_commentId", async (req, res)=>{
    const commentId=req.params._commentId;
    const {password}=req.body;

    const [existsComment] = await Comments.find({_id:commentId});
    if([existsComment].length && existsComment.password===password){
        await Comments.deleteOne({_id:commentId});
        res.json({message : "게시글을 삭제하였습니다."});
        return ;
    }
    else {
        res.json({message : "비밀번호가 일치하지 않습니다."});
        return ;
    }
});


module.exports = router;