/**
 * Error Controller
 * 
 * used by: app.js
 * descriptions: This controller is not for resource managment but for global error handling
 */

const util = require('../../util/server_utilities');
const Logger = require('../../util/logger');
const AppError = require('../../util/error/appError');
const logger = new Logger();

const handleJWTError = () => {
    new AppError('Invalid Authorization Token. Please Log in Again', 401);
}

const handleJWTExpiredError = () => {
    new AppError('Authorization Token Expired. Please Log in Again', 401);
};

module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500; //internal server error
    err.status = err.status || 'error'
    if (process.env.NODE_ENV === 'development') {
        sendErrorDev(err, res);
    } else if (process.env.NODE_ENV.trim() === 'production') {
        let error = { ...err };
        if (error.name === 'JsonWebTokenError') error = handleJWTError();
        if (error.name === 'TokenExpiredError') error = handleJWTExpiredError();

        sendErrorProd(error, res);
    }
}

function sendErrorDev(err, res) {
    util.sendResponse(res, err.statusCode, {
        status: err.status,
        error: err,
        message: err.message,
        stack: err.stack,
    });
}

function sendErrorProd(err, res) {
    console.log("sendErrorProd");
    if(err.isOperational){
        util.sendResponse(res, err.statusCode, {
            status: err.status,
            message: err.message,
        });
    }else{
        //programming error
        logger.log(err).err();
        util.sendResponse(res, 500, {
            status: 'error',
            message: 'Something went wrong',
        });
    }

    
}