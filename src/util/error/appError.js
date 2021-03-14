/**
 * AppError Class
 * 
 * used by: * server file
 * descriptions: expand the default Error for better error handling
 * usage: 
 *   new AppError('error message here', statusCode);
 * NOTE: for all status code start with number 4 will return fail status, error otherwise
 *       most mongoose/mongodb related error will return 500.
 */

class AppError extends Error{
    constructor(message, statusCode){
        super(message);

        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith('4')? 'fail': 'error';
        this.isOperational = true;

        Error.captureStackTrace(this, this.constructor);
    }
}

module.exports = AppError;