const mongoose = require('mongoose');
const Like = require('./likeModel').schema;

const postSchema = new mongoose.Schema({
    public: {
        type: Boolean,
        require: [true, 'A post must have a type'],
        default: true,
    },
    
    //username
    author: {
        type: String,
        required: [true, 'A post must have a author'],
    },

    content: {
        type: String,
        required: [true, 'A post must have content'],
        trim: true,
    },

    attachment:     { type: Array, default: [String] },
    post_ts:        { type: Date, default: Date.now() },
    likes:          [Like],
    comments:       [Number],
});

// postSchema.pre('find', function(next){
postSchema.pre(/^find/, function(next){
    this.find({ public: {$ne: false} });
    next();
})

const Post = mongoose.model('Post', postSchema);
module.exports = Post;