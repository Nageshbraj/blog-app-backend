const User = require('../models/user-model')
const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { validationResult } = require('express-validator')

const userCltr = {}

userCltr.register = async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

    const body = req.body
    try {
        const salt = await bcryptjs.genSalt()
        const hashPassword = await bcryptjs.hash(body.password, salt)
        const user = new User(body)
        user.password = hashPassword
        await user.save()
        res.status(201).json(user)
    } catch (err) {
        res.status(500).json({ error: "Something went wrong" })
    }
}

userCltr.checkEmail = async (req, res) => {
    
    const email = req.query.email
    const user = await User.findOne({email: email})
    if(user){
        res.json({'is_email_registered': true})
    } else {
        res.json({'is_email_registered': false})
    }
}

userCltr.login = async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

    try {
        const body = req.body
        const user = await User.findOne({ email: body.email })
        if (user) {
            const isAuth = await bcryptjs.compare(body.password, user.password)
            if (isAuth) {
                const tokenData = {
                    id: user._id,
                }
                const token = jwt.sign(tokenData, process.env.JWT_SECRET, { expiresIn: '7d' })
                return res.json({ token: token })
            }
            return res.status(400).json({ errors: 'Invalid email/password' })
        }
        return res.status(404).json({ errors: 'Invalid email/password' })
    } catch (err) {
        res.status(500).json({ errors: "Something went wrong" })
    }
}

userCltr.uploadProfilePicture = async (req, res) => {
    try {
        const userId = req.user.id
        const body = req.body

        const user = await User.findByIdAndUpdate(userId, body, { new: true })
        if (!user) {
            return res.status(404).json({ error: 'User not found' })
        }

        res.status(200).json({ message: 'Profile picture updated successfully', user })
    } catch (err) {
        console.log(err)
        res.status(500).json({ error: 'Something went wrong' })
    }
}

userCltr.getProfile = async(req,res)=>{
    const userId = req.user.id
    try{
        const user = await User.findById(userId)
        res.json(user)
    }
    catch(err){
        res.status(500).json({ error: 'Something went wrong' })
    }
}


userCltr.updateProfile = async(req,res)=>{
    const userId = req.user.id
    const body = req.body
    try{
        const user = await User.findByIdAndUpdate(userId,body,{new:true})
        if(!user){
            return res.status(404).json({error:'user not found'})
        }
        res.json(user)
    }
    catch(err){
        res.status(500).json({ error: 'Something went wrong' })
    }

}


module.exports = userCltr