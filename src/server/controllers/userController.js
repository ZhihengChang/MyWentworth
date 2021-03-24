/**
 * User Controller
 * 
 * used by: userRoutes.js
 * descriptions: provides user management functions
 */

//util
const path = require('path');
const util = require("../../util/server_utilities");
const Logger = require("../../util/Logger");
const DBAPI = require("../../util/DBAPI");
const AppError = require('../../util/error/appError');
const catchAsync = require('../../util/error/catchAsync');

//Models
const Student = require('../models/studentModel');
const User = require('../models/userModel');


const logger = new Logger(path.basename(__filename));
logger.details(true);


//Controller Functions

/**
 * Get specific user by object id
 */
exports.getUser = catchAsync( async function (req, res, next) {
    let id = req.params.id;
    logger.log("get user " + req.params.id).msg();

    const user = await User.findById(id);
    if(!user){
        return next(new AppError(`No user found with Id ${id}`, 404));
    }
    util.sendResponse(res, 200, {
        status: 'success',
        data: { user }
    });
});


/**
 * Get all users in user collections
 */
exports.getAllUser = catchAsync( async function (req, res, next) {
    logger.log("get all users").msg();

    //modify query with DBAPI
    const result = new DBAPI(User.find(), req.query)
        .filter()
        .sort()
        .limitFields()
        .paginate();

    const users = await result.query;
    util.sendResponse(res, 200, {
        status: 'success',
        result: result.length,
        data: { users }
    });
});

/**
 * Create a user based on request body
 */
exports.createUser = catchAsync( async function (req, res, next) {
    logger.log("create user").msg();

    const newUser = await User.create(req.body);
    util.sendResponse(res, 201, {
        status: 'success',
        data: { user: newUser }
    });
});

/**
 * Delete a specific user by object id
 */
exports.deleteUser = catchAsync( async function (req, res, next) {
    logger.log("delete user " + req.params.id).msg();

    const user = await User.findByIdAndDelete(req.params.id);
    if(!user){
        return next(new AppError(`No user found with Id ${id}`, 404))
    }
    util.sendResponse(res, 200, {
        status: 'success',
        data: { user }
    });
});

/**
 * Update a user based on request body
 */
exports.updateUser = catchAsync( async function (req, res, next) {
    let id = req.params.id
    logger.log("update user " + id).msg();

    const user = await User.findByIdAndUpdate(id, req.body, {
        new: true,              //return updated document
        runValidators: true,    //validate model  
    });
    if(!user){
        return next(new AppError(`No user found with Id ${id}`, 404));
    }
    util.sendResponse(res, 204, {
        status: 'success',
        data: null,
    });
});

/**
 * Update current user profile
 */
exports.updateProfile = catchAsync( async function (req, res, next) {
    // User can not update password
    if(req.body.password || req.body.passwordConfirm){
        return next(
            new AppError(
                'User password can NOT be update here',
                400
            )
        );
    }

    // Update user
    const filteredBody = util.filterObject(req.body, 'username', 'email');
    const user = await User.findByIdAndUpdate(req.user.id, filteredBody, {
        new: true,
        runValidators: true,
    });

    util.sendResponse(res, 200, {
        status: "success",
    });
})