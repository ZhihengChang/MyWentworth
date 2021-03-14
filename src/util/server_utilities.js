/**
 * server_utilites
 * 
 * used by: * server side file
 * descriptions: simplify server operations and to client communications
 */
module.exports = {
    //server
    sendResponse,
}

const logger = require("./logger");

/**
 * Send json response with status code
 * @param {Response} res 
 * @param {Number} statusCode 
 * @param {Object} data 
 */
function sendResponse(res, statusCode, data){
    res.status(statusCode).json(data);
}