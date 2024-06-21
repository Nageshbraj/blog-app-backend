const jwt = require('jsonwebtoken')

const authenticateUser = (req,res,next) => {
    const token = req.headers['authorization']
    if(!token){
        return res.status(400).json({errors: 'token is required'})
    }
    try {
        const tokenData = jwt.verify(token, process.env.JWT_SECRET)
        req.user = tokenData
        next()
    } catch(err){
        res.status(500).json({errors: err})
    }
}

module.exports = authenticateUser