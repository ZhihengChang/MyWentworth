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
exports.getAllPosts = async function (req, res) {
    logger.log("get all posts").msg(); 
    try {
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
    }catch(err){
        util.sendResponse(res, 404, {
            status: 'fail',
            message: err
        });
    }
}

/**
 * Create a post based on request body
 * @param {Request} req 
 * @param {Response} res 
 */
exports.createPost = async function (req, res) {
    logger.log("create post author " + req.body.author).msg();
    try {
        const newPost = await Post.create(req.body);
        util.sendResponse(res, 200, {
            status: 'success',
            data: { post: newPost }
        });
    } catch (err) {
        util.sendResponse(res, 404, {
            status: 'fail',
            message: err
        });
    }
}

