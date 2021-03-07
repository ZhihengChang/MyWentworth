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

//Models
const Student = require('../models/studentModel');
const User = require('../models/userModel');


//Middlewares


//Controller Functions
exports.getUser = function(req, res){
    logger.log('userid: ' + req.params);
    util.sendResponse(res, 200, {message: "User Get"});
}

exports.getAllUser = function(req, res){

}

exports.createUser = async function(req, res){
    try{
        const newUser = await User.create(req.body);
        util.sendResponse(res, 200, {
            status: 'success',
            data: { user: newUser }
        });
    }catch(err){
        util.sendResponse(res, 400, {
            status: 'fail',
            message: err
        });
    }   
}

exports.deleteUser = function(req, res){
    logger.log('userid: ' + req.params);
    util.sendResponse(res, 200, {message: "User Deleted"});
}

exports.updateUser = function(req, res){
    logger.log('userid: ' + req.params);
    util.sendResponse(res, 200, {message: "User Updated"});
}