const Post = require('../models/post-model')
const { validationResult} = require('express-validator')

const postCtlr = {}

postCtlr.create = async (req,res) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()})
    }
    try {
        const body = req.body
        const post = new Post(body)
        post.author = req.user.id
        await post.save()
        res.status(201).json(post)

    } catch(err){
        console.log(err)
        res.status(500).json({errors: 'something went wrong'})
    }
}

postCtlr.list = async (req,res) => {
    try {
        const post = await Post.find()
        res.json(post)
    } catch(err){
        res.status(500).json({errors: 'something went wrong'})
    }
}

postCtlr.single = async (req, res) => {
    const id = req.params.id 
    try {
        const post = await Post.findById(id)
        res.json(post)
    } catch(err) {
        res.status(500).json({ error: 'something went wrong'})
    }
}

postCtlr.update = async (req, res) => {
    const id = req.params.id 
    const body = req.body 
    try{
        const post = await Post.findOneAndUpdate({ author: req.user.id, _id: id }, body, { new: true })
    if(!post) {
        return res.status(404).json({ error: 'record not found'})
    }
    res.json(post) 
    } catch(err) {
        res.status(500).json({ error: 'something went wrong'})
    } 
}

postCtlr.remove = async (req, res) => {
    const id = req.params.id 
    try {
        const post = await Post.findOneAndDelete({ author: req.user.id, _id: id })
    if(!post) {
        return res.status(404).json({ error: 'record not found'})
    }
    res.json(post) 
    } catch(err) {
        res.status(500).json({ error: 'something went wrong'})
    }   
}

postCtlr.my = async (req,res) => {
    try {
        const posts = await Post.find({author: req.user.id})
        res.json(posts)
    } catch(err){
        res.status(500).json({errors: 'something wemt wrong'})
    }
}

module.exports = postCtlr