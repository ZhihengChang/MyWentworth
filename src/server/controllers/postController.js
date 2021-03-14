/**
 * Post Controller
 * 
 * author: Zhiheng Chang
 * contributor:
 * used by: postRoutes.js
 * descriptions: provides post management functions
 * date added: 03/08/2021
 */

//util
const path = require('path');
const util = require("../../util/server_utilities");
const Logger = require("../../util/Logger");
const logger = new Logger(path.basename(__filename));
logger.details(true);

const DBAPI = require("../../util/DBAPI");

//Models
const Student = require('../models/studentModel');
const User = require('../models/userModel');
const Post = require('../models/postModel');


//Middlewares




//Controller Functions

/**
 * Get all posts in posts collections
 * @param {Request} req 
 * @param {Response} res 
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
 * @param {Request} req 
 * @param {Response} res 
 */
exports.createPost = catchAsync(async function (req, res, next) {
    logger.log("create post author " + req.body.author).msg();
    
    const newPost = await Post.create(req.body);
    util.sendResponse(res, 200, {
        status: 'success',
        data: { post: newPost }
    });
});

