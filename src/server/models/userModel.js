const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    userid:{
        type: Number,
        required: [true, 'A user must have a user ID'],
        default: 1000,
        unique: true
    },
    
    wit_id: {
        type: String,
        required: [true, 'A user must have a WIT ID'],
        unique: true
    },

    username: {
        type: String,
        required: [true, 'A user must have a username'],
        trim: true,
        unique: true
    },

    password: {
        type: String,
        //required: [true, 'A user must have a password']
    },

    avatar:         { type: String, },
    status:         { type: String, default: "offline" },
    notifications:  { type: Array, default: [Number] },
    friends:        { type: Array, default: [Number] },
    posts:          { type: Array, default: [Number] },
    chats:          { type: Array, default: [Number] },
    login_ts:       { type: Date, default: new Date(0) },
    logout_ts:      { type: Date, default: new Date(0) },
    signup_ts:      { type: Date, default: Date.now() },
});

const User = mongoose.model('User', userSchema);
module.exports = User;