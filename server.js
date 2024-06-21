const express = require('express')
const port = 5000
const app = express()
const cors = require('cors')
const configureDB = require('./config/db')
require('dotenv').config()
const { checkSchema } = require('express-validator')
const userRegisterValidationSchema = require('./app/validations/user-register-validator')
const userLoginValidationSchema = require('./app/validations/user-login-validator')
const upload = require('./app/middelwares/multer')
const userCltr = require('./app/controllers/user-ctlr')
const postCtlr = require('./app/controllers/post-ctlr')
const commentCtlr = require('./app/controllers/comments-ctlr')
const authenticateUser = require('./app/middelwares/authenticateUser')

const path = require('path')
configureDB()
app.use(express.json())
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))) // Serve static files from the uploads directory
app.use(cors())


app.post('/api/users/register', checkSchema(userRegisterValidationSchema), userCltr.register)

app.post('/api/users/login', checkSchema(userLoginValidationSchema), userCltr.login)

app.get('/api/users/checkemail', userCltr.checkEmail)

app.post('/api/users/upload-profile-picture', authenticateUser, upload.single('profilePicture'), userCltr.uploadProfilePicture)

app.get('/api/users/profile', authenticateUser, userCltr.getProfile)

app.post('/api/posts', authenticateUser, postCtlr.create)

app.get('/api/posts', authenticateUser, postCtlr.list)

app.get('/api/posts/myposts', authenticateUser, postCtlr.my)

app.get('/api/posts/:id', authenticateUser, postCtlr.single)

app.put('/api/posts/:id', authenticateUser, postCtlr.update)

app.delete('/api/posts/:id', authenticateUser, postCtlr.remove)

app.post('/api/posts/:postId/comments', authenticateUser, commentCtlr.create)

app.get('/api/posts/:postId/comments', authenticateUser, commentCtlr.list)

app.put('/api/posts/:postId/comments/:commentId', authenticateUser, commentCtlr.update)

app.delete('/api/posts/:postId/comments/:commentId', authenticateUser, commentCtlr.remove)


app.listen(port, () => {
    console.log('connected to server successfully', port)
})