/**
 * User Controller
 * 
 * author: Zhiheng Chang
 * contributor:
 * used by: userRoutes.js
 * descriptions: provides user management functions
 * date added: 03/03/2021
 */

//util
const path = require('path');
const util = require("../../util/server_utilities");
const Logger = require("../../util/Logger");
const logger = new Logger(path.basename(__filename));
logger.details(true);

//Models
const Student = require('../models/studentModel');
const User = require('../models/userModel');


//Middlewares


//Controller Functions
/**
 * Get specific user by object id
 * @param {*} req 
 * @param {*} res 
 */
exports.getUser = async function (req, res) {
    logger.log("get user " + req.params.id).msg();
    try {
        const user = await User.findById(req.params.id);
        util.sendResponse(res, 200, {
            status: 'success',
            data: { user }
        });
    }catch(err){
        util.sendResponse(res, 404, {
            status: 'fail',
            message: err
        });
    }
}

/**
 * Get all users in user collections
 * pagenation { $lte/gte/gt/lt: Number } should be considered
 * @param {*} req 
 * @param {*} res 
 */
exports.getAllUser = async function (req, res) {
    logger.log("get all users").msg();
    //req should contain pagenation 
    try {
        const users = await User.find();
        util.sendResponse(res, 200, {
            status: 'success',
            data: { users }
        });
    }catch(err){
        util.sendResponse(res, 404, {
            status: 'fail',
            message: err
        });
    }
}

/**
 * Create a user based on request body
 * @param {*} req 
 * @param {*} res 
 */
exports.createUser = async function (req, res) {
    logger.log("create user " + req.body.wit_id).msg();
    try {
        const newUser = await User.create(req.body);
        util.sendResponse(res, 200, {
            status: 'success',
            data: { user: newUser }
        });
    } catch (err) {
        util.sendResponse(res, 404, {
            status: 'fail',
            message: err
        });
    }
}

/**
 * Delete a specific user by object id
 * @param {*} req 
 * @param {*} res 
 */
exports.deleteUser = async function (req, res) {
    logger.log("delete user " + req.params.id).msg();
    try {
        const result = await User.findByIdAndDelete(req.params.id);
        util.sendResponse(res, 200, {
            status: 'success',
            data: { result }
        });
    } catch (err) {
        util.sendResponse(res, 404, {
            status: 'fail',
            message: err
        });
    }
}

/**
 * Update a user based on request body
 * @param {*} req 
 * @param {*} res 
 */
exports.updateUser = async function (req, res) {
    logger.log("update user " + req.params.id).msg();
    try {
        const user = await User.findByIdAndUpdate(req.params.id, req.body, {
            new: true,              //return updated document
            runValidators: true,    //validate model  
        })
        util.sendResponse(res, 204, {
            status: 'success',
            data: null,
        });
    } catch (err) {
        util.sendResponse(res, 404, {
            status: 'fail',
            message: err
        });
    }
}