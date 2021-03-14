const util = require('../../util/server_utilities');
const User = require('./../models/userModel');
const catchAsync = require('../../util/error/catchAsync');

exports.signup = catchAsync(async function(req, res, next){
    const newUser = await User.create(req.body);
    util.sendResponse(res, 201, {
        status: 'success',
        data: { user: newUser }
    });
});