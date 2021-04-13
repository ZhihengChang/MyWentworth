/**
 * Post Controller
 * 
 * used by: postRoutes.js
 * descriptions: provides post management functions
 */

//util
const path = require('path');
const util = require("../../util/server_util");
const Logger = require("../../util/Logger");
const logger = new Logger(path.basename(__filename));
logger.details(true);

const DBAPI = require("../../util/DBAPI");

//Models
const Student = require('../models/studentModel');
const User = require('../models/userModel');
const Post = require('../models/postModel');
const catchAsync = require('../../util/error/catchAsync');
const AppError = require('../../util/error/appError');


//Middlewares




//Controller Functions

/**
 * Get all posts in posts collections
 */
exports.getAllPosts = catchAsync(async function (req, res, next) {
    logger.log("get all posts").msg();
    //modify query with DBAPI
    const result = new DBAPI(Post.find(), req.query)
        .filter()
        .sort()
        .limitFields()
        .paginate();

    const posts = await result.query;
    util.sendResponse(res, 200, {
        status: 'success',
        result: result.length,
        data: { posts }
    });
});

/**
 * Create a post based on request body
 */
exports.createPost = catchAsync(async function (req, res, next) {
    logger.log("create post author " + req.body.author).msg();
    
    const newPost = await Post.create(req.body);
    util.sendResponse(res, 200, {
        status: 'success',
        data: { post: newPost }
    });
});

/**
 * Like or Dislike a post
 */
exports.likePost = catchAsync(async function (req, res, next) {

    let message = 'liked';
    const post_id = req.body.post_id;
    const user_id = req.body.user_id;

    // Validate the post still exist
    const user = await User.findById(user_id);
    const post = await Post.findById(post_id);
    if(!post){
        return next(
            new AppError(
                'Post has been deleted',
                404
            )
        );
    }

    if(post.likes.indexOf(user_id) != -1 && user.likes.indexOf(post_id) != -1){
        util.findAndRemove(post.likes, user_id)
        util.findAndRemove(user.likes, post_id)
        message = 'disliked';
    }else{
        // Add user_id and post_id to post and user
        post.likes.push(user_id);
        user.likes.push(post_id);  
    }

    await post.save();
    await user.save({ validateBeforeSave: false });

    util.sendResponse(res, 200, {
        status: 'success',
        message,
    });
});

