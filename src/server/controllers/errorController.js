/**
 * Error Controller
 * 
 * used by: app.js
 * descriptions: This controller is not for resource managment but for global error handling
 */

const util = require('../../util/server_util');
const Logger = require('../../util/logger');
const AppError = require('../../util/error/appError');
const logger = new Logger();

function handleJWTError () {
    new AppError('Invalid Authorization Token. Please Log in Again', 401);
}

function handleJWTExpiredError () {
    new AppError('Authorization Token Expired. Please Log in Again', 401);
};

function handleValidationErrorDB (err) {
    const errors = Object.values(err.errors).map(el => el.message);
    const message = `Invalid input data. ${errors.join('. ')}`;
    return new AppError(message, 400);
};

module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500; //internal server error
    err.status = err.status || 'error'
    if (process.env.NODE_ENV === 'development') {
        sendErrorDev(err, req, res);
    } else if (process.env.NODE_ENV.trim() === 'production') {
        let error = { ...err };
        // console.log(err.name);
        if (error.name === 'JsonWebTokenError') error = handleJWTError();
        if (error.name === 'TokenExpiredError') error = handleJWTExpiredError();
        if (err.name === 'ValidationError') error = handleValidationErrorDB(error);

        sendErrorProd(error, req, res);
    }
}

function sendErrorDev(err, req, res) {
    if(req.originalUrl.startsWith('/api')){
        util.sendResponse(res, err.statusCode, {
            status: err.status,
            error: err,
            message: err.message,
            stack: err.stack,
        });
    }else{
        util.renderPage(res, err.statusCode, 'error', {
            title: 'Somithing went wrong!',
            msg: err.message
        })
    }
    
}

function sendErrorProd(err, req, res) {
    if(err.isOperational){
        util.sendResponse(res, err.statusCode, {
            status: err.status,
            message: err.message
        });
    }else{
        //programming error
        util.sendResponse(res, 500, {
            status: 'error',
            message: 'Something went wrong',
        });
    }
}