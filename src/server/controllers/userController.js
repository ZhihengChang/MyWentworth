/**
 * User Controller
 * 
 * author: Zhiheng Chang
 * contributor:
 * used by: userRoutes.js
 * descriptions: provides user management functions
 * date added: 03/03/2021
 */

//require server_utilities for global helper functions access
const util = require("../../util/server_utilities");
const logger = require("../../util/logger");

//Middlewares

/**
 * validateUserId middleware is used in userController
 * to validate userid in the request url
 * @param {Request} req 
 * @param {Response} res 
 * @param {Function} next 
 * @param {String} value userid
 */
exports.validateUserId = function(req, res, next, value){
    logger.log(`userid is ${value}`);
    //count total number of users
    let max = 10000; //replace this with db count operation
    if(value < 0 || value > max) {
        return util.sendResponse(res, 400, {
            status: "failed",
            message: "Error: invalid user id"
        });
    }
    next();
}

/**
 * validateAuthToken middleware is used in userController
 * to validate user's session and is valid to sending request and recieving response
 * @param {Request} req 
 * @param {Response} res 
 * @param {Function} next 
 */
exports.validateAuthToken = function(req, res, next){
    let authToken = req.body.user.authToken;
    logger.log(`authToken: ${authToken}`);
    //get authtoken from db
    //check authtoken in req.body match with db
    next();
}

//Controller Functions

exports.handleUserLogin = function(req, res){
    // res.render("mywit_login");
    util.sendResponse(res, 200, {message: `User Login Successful`});
}

exports.getUser = function(req, res){
    logger.log('userid: ' + req.params);
    util.sendResponse(res, 200, {message: "User Get"});
}

exports.deleteUser = function(req, res){
    logger.log('userid: ' + req.params);
    util.sendResponse(res, 200, {message: "User Deleted"});
}

exports.updateUser = function(req, res){
    logger.log('userid: ' + req.params);
    util.sendResponse(res, 200, {message: "User Updated"});
}