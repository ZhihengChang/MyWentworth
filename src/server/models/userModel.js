const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    wit_id: {
        type: String,
        required: [true, 'Please provide a WIT ID'],
        unique: true
    },

    username: {
        type: String,
        required: [true, 'Please provide a username'],
        trim: true,
        unique: true,
        maxlength: [40, 'A username must have lesser than or equal to 40 characters'],
        minlength: [1, 'A username must have greater than or equal to 1 characters'],
    },

    email: {
        type: String,
        required: [true, 'Please provide an email'],
        unique: true,
        lowercase: true,
        validate: [ validator.isEmail, 'Please provide a valid email' ]
    },

    password: {
        type: String,
        required: [true, 'Please provide a password'],
        minlength: 8,
        select: false,
    },

    passwordConfirm: {
        type: String,
        require: [true, 'Please confirm password'],
        validate: {
            //only works on create and save
            validator: function(el){
                return el === this.password;
            },
            message: 'Password Mismatch!'
        }
    },

    passwordChange_ts:  { type: Date, },
    avatar:             { type: String, },
    status:             { type: String, default: "offline" },
    notifications:      { type: Array, default: [String] },
    friends:            { type: Array, default: [String] },
    posts:              { type: Array, default: [String] },
    chats:              { type: Array, default: [String] },
    login_ts:           { type: Date, default: new Date(0) },
    logout_ts:          { type: Date, default: new Date(0) },
    signup_ts:          { type: Date, default: Date.now() },
});

/**
 * Pre save hook:
 * Hash the password and delete passwordConfirm field in the document
 */
userSchema.pre('save', async function(next){
    if(!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 12);
    this.passwordConfirm = undefined;
    next();
});

/**
 * Validate both password match
 * @param {String} candidatePassword: input password
 * @param {String} userPassword: user password in db
 * @returns 
 */
userSchema.methods.correctPassword = async function(candidatePassword, userPassword){
    return await bcrypt.compare(candidatePassword, userPassword);
};

/**
 * Check JWT is assign to the user before user changed password
 * return false if JWT is assign to user after password changed
 * @param {Number} JWT_ts 
 * @returns boolean
 */
userSchema.methods.changedPasswordAfter = function(JWT_ts){
    if(this.passwordChange_ts){
        const changed_ts = parseInt(this.passwordChange_ts.getTime() / 1000, 10);
        return JWT_ts < changed_ts;
    }
    return false;
}

const User = mongoose.model('User', userSchema);
module.exports = User;