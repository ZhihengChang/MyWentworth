const mongoose = require('mongoose');
const likeSchema = new mongoose.Schema({
    post_id:{
        type: String,
        required: [true, 'A Like must have a post id'],
    },
    
    user_id: {
        type: String,
        required: [true, 'A Like must have a user id'],
    },

});

const Like = mongoose.model('Like', likeSchema);
module.exports = Like;