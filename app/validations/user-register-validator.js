const User = require('../models/user-model')

const userRegisterValidationSchema = {
    username: {
        in: ['body'],
        exists: {
            errorMessage: 'username is required'
        },
        trim: true,
        notEmpty: {
            errorMessage: 'username cannot be empty'
        }
    },
    email: {
        in: ['body'],
        exists: {
            errorMessage: 'email is required'
        },
        trim: true,
        notEmpty: {
            errorMessage: 'email cannot be empty'
        },
        isEmail: {
            errorMessage: 'email should be valid format'
        },
        normalizeEmail: true,
        custom: {
            options: async function(value){
                const email = await User.findOne({email: value})
                if(email){
                    throw new Error('email already taken')
                } else {
                    return true
                }
            }
        }
    },
    password: {
        in: ['body'],
        exists: {
            errorMessage: 'password is required'
        },
        trim: true,
        notEmpty: {
            errorMessage: 'password cannot be empty'
        },
        isLength: {
            options: {min: 8, max: 128},
            errorMessage: 'password length should be between 8-128'
        }
    }
}

module.exports = userRegisterValidationSchema