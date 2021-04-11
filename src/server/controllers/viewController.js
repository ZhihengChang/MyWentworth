/**
 * View Controller
 * 
 * used by: *Routes.js
 * descriptions: This controller provides dynamic page rendering
 */
const util = require('../../util/server_util');
const catchAsync = require('../../util/error/catchAsync');

const Post = require('../models/postModel');


exports.renderUserLogin = function(req, res){
    util.renderPage(res, 200, 'login', {
        title: "User Login"
    });
}

exports.renderUserHome = catchAsync( async function(req, res) {
    // Get all public posts
    const posts = await Post.find().sort( { post_ts: -1 });

    // Build template

    // Rendering
    util.renderPage(res, 200, 'home', {
        title: "Home",
        posts
    });
});

exports.renderUserSignup = function(req, res){
    util.renderPage(res, 200, 'signup', {
        title: "User Signup" 
    });
}

exports.renderUserProfile = function(req, res){
    util.renderPage(res, 200, 'account', {
        title: "Me" 
    });
}