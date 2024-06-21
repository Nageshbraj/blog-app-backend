const Comment = require('../models/comments-model')
const Post = require('../models/post-model')
const { validationResult} = require('express-validator')
const _ = require('lodash')


const commentCtlr = {}

commentCtlr.create = async (req,res) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()})
    }
    try {
        const body = _.pick(req.body, ['content'])
        const postId = req.params.postId
        const comment = new Comment(body)
        comment.author = req.user.id
        comment.post = postId
        await comment.save()
        await Post.findByIdAndUpdate(postId, { $push: { comments: comment._id } },{ new: true })
        res.status(201).json(comment)

    } catch(err){
        console.log(err)
        res.status(500).json({errors: 'something wemt wrong'})
    }
}


commentCtlr.list = async (req,res) => {
    const postId = req.params.postId
    try {
        const comments = await Comment.find({ post: postId })
        res.json(comments)

    } catch(err){
        console.log(err)
        res.status(500).json({errors: 'something wemt wrong'})
    }
}

commentCtlr.update = async (req,res) => {
    try{
        const commentId = req.params.commentId
        const body = req.body
       
        const comment  = await Comment.findOneAndUpdate({_id:commentId,author:req.user.id},body,{new:true})
        if (!comment) {
            return res.status(404).json({ error: 'Comment not found' });
        }
    
        res.json(comment)
     }
     catch(error){
        res.status(500).json({ error: 'Something went wrong' });
     }    
}

commentCtlr.remove = async (req,res) => {
    try{
        const commentId = req.params.commentId
        const postId  = req.params.postId
       
           const comment = await Comment.findById(commentId)
           const post = await Post.findById(postId)
         //   console.log(post,comment)
         //  console.log(req.user.id)
           if(comment.author.toString() === req.user.id || post.author.toString() === req.user.id){
             const deletedComment  = await Comment.findByIdAndDelete(commentId)
                if (!deletedComment) {
                    return res.status(404).json({ error: 'Comment not found' });
                }
                await Post.findByIdAndUpdate(comment.post, { $pull: { comments: commentId } });
         
                res.json({ message: 'Comment deleted successfully', deletedComment });
           }
           else{
             res.json({errors: 'error'})
           }
     }
     catch(error){
        res.status(500).json({ error: 'Something went wrong' });
     }
 
}


module.exports = commentCtlr