/**
 * Authorization Controller
 * 
 * used by: *Routes.js
 * descriptions: This controller provides user authorization and protection
 */

const { promisify } = require('util');
const util = require('../../util/server_utilities');
const AppError = require("../../util/error/appError");
const jwt = require('jsonwebtoken');
const User = require('./../models/userModel');
const catchAsync = require('../../util/error/catchAsync');
const sendEmail = require('../../util/email');
const { decode } = require('punycode');

/**
 * Create a JWT token based on the given user id
 * @param {String} id: Mongodb _id
 * @returns 
 */
const signToken = function(id){
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
    });
}

/**
 * User signup, return the new user object with JWT token
 */
exports.signup = catchAsync(async function(req, res, next){
    const newUser = await User.create({

        wit_id:             req.body.wit_id,
        username:           req.body.username,
        email:              req.body.email,
        password:           req.body.password,
        passwordConfirm:    req.body.passwordConfirm,
        role:               req.body.role,

    });
    
    const token = signToken(newUser._id);

    util.sendResponse(res, 201, {
        status: 'success',
        token,
        data: { user: newUser }
    });
});

/**
 * User login, upon successful login, return the logged in user with JWT token
 */
exports.login = catchAsync(async function(req, res, next){
    const { username, password } = req.body;

    //check username password exist
    if(!username || !password) {
        return next(new AppError('Please provide username and password!', 400));
    }

    // check username password is correct
    const user = await User.findOne({ username }).select('+password');
    if(!user || !(await user.correctPassword(password, user.password))){
        return next(new AppError('Incorrect username or password', 401));
    }

    // send token
    const token = signToken(user._id);
    util.sendResponse(res, 200, {
        status: 'success',
        token,
    });
});

/**
 * Verify user authorization for specific action
 */
exports.protect = catchAsync(async function(req, res, next){
    //get token and check exist
    let token;
    if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")){
        token = req.headers.authorization.split(' ')[1];
    }
    
    if (!token) {
        return next(
            new AppError(
                'Not Authorized! Please log in.', 
                401
            )
        );
    }

    //validate token
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    //check user still exists
    const user = await User.findById(decoded.id);
    
    if (!user) {
        return next(
            new AppError(
                'The user belonging to this token is not exist', 
                401
            )
        );
    }

    //check user changed password after the token was issued
    if (user.changedPasswordAfter(decoded.iat)) {
        return next(
            new AppError(
                'User Password Recently Changed. Please Log in Again.', 
                401
            )
        );
    };

    //access granted
    req.user = user;

    next();
});

exports.restrictTo = (...roles) => {
    return (req, res, next) => {
        if(!roles.includes(req.user.role)){
            return next(
                new AppError(
                    'You do not have permission to perform this action.', 
                    403
                )
            );
        }
        next();
    };
}

exports.forgotPassword = catchAsync(async function(req, res, next) {
    //get user based on post email
    let email = req.body.email;
    const user = await User.findOne({ email });

    if(!user){
        return next(
            new AppError(
                'There is no user with email address.',
                404
            )
        );
    }

    //generate the random reset token
    const resetToken = user.createPasswordResetToken();
    await user.save({ 
        validateBeforeSave: false 
    });

    //send token to user's email
    const resetURL = `${req.protocol}://${req.get('host')}/users/resetPassword/${resetToken}`;
    const message = `Forgot your password? Submit your new password and confirm password at: ${resetURL}.`;

    try{
        await sendEmail({
            email,
            subject: 'Your Password Reset Token (Expires in 10 mins)',
            message,
        });
    
        util.sendResponse(res, 200, {
            status: 'sucess',
            message: 'Token sent to email!',
        });

    }catch(err){
        console.log(err);
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;

        await user.save({ 
            validateBeforeSave: false 
        });

        return next(
            new AppError(
                'There was an error sending the email, please try again later.',
                500
            )
        );
    }
    
});

exports.resetPassword = function(req, res, next) {

}