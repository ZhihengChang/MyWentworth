const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    wit_id: {
        type: String,
        required: [true, 'A user must have a WIT ID'],
        unique: true
    },

    username: {
        type: String,
        required: [true, 'A user must have a username'],
        trim: true,
        unique: true,
        maxlength: [40, 'A user name must have lesser than or equal to 40 characters'],
        minlength: [1, 'A user name must have greater than or equal to 1 characters'],
    },

    password: {
        type: String,
        required: [true, 'A user must have a password'],
        minlength: 8
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

    avatar:         { type: String, },
    status:         { type: String, default: "offline" },
    notifications:  { type: Array, default: [String] },
    friends:        { type: Array, default: [String] },
    posts:          { type: Array, default: [String] },
    chats:          { type: Array, default: [String] },
    login_ts:       { type: Date, default: new Date(0) },
    logout_ts:      { type: Date, default: new Date(0) },
    signup_ts:      { type: Date, default: Date.now() },
});

userSchema.pre('save', async function(next){
    if(!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 12);
    this.passwordConfirm = undefined;
    next();
})

const User = mongoose.model('User', userSchema);
module.exports = User;