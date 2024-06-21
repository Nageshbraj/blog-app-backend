

const userLoginValidationSchema = {
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
    },
}

module.exports = userLoginValidationSchema