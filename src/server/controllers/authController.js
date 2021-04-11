/**
 * Authorization Controller
 * 
 * used by: *Routes.js
 * descriptions: This controller provides user authorization and protection
 */

const { promisify } = require('util');
const crypto = require('crypto');
const util = require('../../util/server_util');
const AppError = require("../../util/error/appError");
const jwt = require('jsonwebtoken');
const catchAsync = require('../../util/error/catchAsync');
const sendEmail = require('../../util/email');

const User = require('./../models/userModel');
const Student = require('../models/studentModel');

/**
 * Create a JWT token based on the given user id
 * @param {String} id: Mongodb _id
 * @returns 
 */
const signToken = function (id) {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
    });
}

/**
 * Create JWT token and send the token in response
 * @param {Response} res 
 * @param {Number} statusCode 
 * @param {Object} user 
 */
const createTokenAndSend = function (res, statusCode, user) {
    const token = signToken(user._id);
    const cookieOptions = {
        expires: new Date(
            Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
        ),
        httpOnly: true,
    };

    if (process.env.NODE_ENV.trim() === 'production') {
        cookieOptions.secure = true;
    }

    res.cookie('jwt', token, cookieOptions);

    user.password = undefined;

    util.sendResponse(res, statusCode, {
        status: "success",
        token,
        data: { user }
    });
}

/**
 * User signup, return the new user object with JWT token
 */
exports.signup = catchAsync(async function (req, res, next) {
    
    const wit_id = req.body.wit_id;

    // Validate wit id
    const student = await Student.findOne({ wit_id });
    if(!student){
        return next(
            new AppError(
                'No WIT ID found, contact Tech Spot for help',
                404
            )
        );
    }

    // Validate user already exist
    const user = await User.findOne({ wit_id });
    if(user){
        return next(
            new AppError(
                'User with this WIT ID already exist, try log in',
                409
            )
        );
    }

    const newUser = await User.create({

        wit_id: req.body.wit_id,
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm,
        role: req.body.role,

    });

    createTokenAndSend(res, 201, newUser);
});

/**
 * User login, upon successful login, return the logged in user with JWT token
 */
exports.login = catchAsync(async function (req, res, next) {
    const { username, password } = req.body;

    //check username password exist
    if (!username || !password) {
        return next(new AppError('Please provide username and password!', 400));
    }

    // check username password is correct
    const user = await User.findOne({ username }).select('+password');
    if (!user || !(await user.correctPassword(password, user.password))) {
        return next(new AppError('Incorrect username or password', 401));
    }

    // send token
    createTokenAndSend(res, 200, user);
});

/**
 * User logout
 */
exports.logout = catchAsync(async function(req, res, next){
    res.cookie('jwt', 'loggedout', {
        expires: new Date(Date.now()),
        httpOnly: true,
    });
    util.sendResponse(res, 200, { status: 'success' });
});

/**
 * Verify user authorization for specific action
 */
exports.protect = catchAsync(async function (req, res, next) {
    //get token and check exist
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies.jwt) {
        token = req.cookies.jwt;
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

/**
 * For page rendering, no errors
 */
exports.isLoggedIn = catchAsync(async function (req, res, next) {
    //get token and check exist
    let token;
    if (req.cookies.jwt) {

        //validate token
        const decoded = await promisify(jwt.verify)(
            req.cookies.jwt,
            process.env.JWT_SECRET
        );

        //check user still exists
        const user = await User.findById(decoded.id);
        if (!user) {
            return next();
        }

        //check user changed password after the token was issued
        if (user.changedPasswordAfter(decoded.iat)) {
            return next();
        };

        //there is a logged in user
        res.locals.user = user
        // next();
    }
    next();
});

/**
 * Restrict other roles' access except given role to a route 
 * @param  {...String} roles 
 * @returns next function
 */
exports.restrictTo = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
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

/**
 * Update current user password
 */
exports.updatePassword = catchAsync(async function (req, res, next) {
    // Get user
    const user = await User.findById(req.user.id).select('+password');

    // Check given password is correct
    if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
        return next(
            new AppError(
                'Your current password is incorrect',
                401
            )
        );
    }

    // Update password
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    await user.save(); //middleware and validators only works when save()

    // Log user in send JWT
    createTokenAndSend(res, 200, user);
});

/**
 * Send a forgot password email to the given user email it the email exist
 */
exports.forgotPassword = catchAsync(async function (req, res, next) {
    //get user based on post email
    let email = req.body.email;
    const user = await User.findOne({ email });

    if (!user) {
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

    try {
        await sendEmail({
            email,
            subject: 'Your Password Reset Token (Expires in 10 mins)',
            message,
        });

        util.sendResponse(res, 200, {
            status: 'sucess',
            message: 'Token sent to email!',
        });

    } catch (err) {
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

/**
 * Reset the user password and update JWT
 */
exports.resetPassword = catchAsync(async function (req, res, next) {
    // Get user based on the token
    const hashedToken = crypto
        .createHash('sha256')
        .update(req.params.token)
        .digest('hex');

    const user = await User.findOne({
        passwordResetToken: hashedToken,
        passwordResetExpires: { $gt: Date.now() }
    });

    if (!user) {
        return next(
            new AppError(
                'Token is invalid or has expired',
                400
            )
        );
    }

    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;

    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    // Log the user in send JWT
    createTokenAndSend(res, 200, user);
});