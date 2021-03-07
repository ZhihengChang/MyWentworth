const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    wit_id: {
        type: String,
        required: [true, 'A user must have a WIT ID'],
        unique: true
    },

    username: {
        type: String,
        required: [true, 'A user must have a username'],
        unique: true
    },

    password: {
        type: String,
        //required: [true, 'A user must have a password']
    },

    status:         { type: String, default: "offline" },
    notifications:  { type: Array, default: [] },
    friends:        { type: Array, default: [] },
    posts:          { type: Array, default: [] },
    chats:          { type: Array, default: [] },
    login_ts:       { type: Number, default: 0 },
    logout_ts:      { type: Number, default: 0 },
    signup_ts:      { type: Number, default: new Date().getTime() },
});

const User = mongoose.model('User', userSchema);
module.exports = User;