/**
 * server_utilites
 * 
 * author: Zhiheng Chang
 * contributor:
 * used by: * server side file
 * descriptions: simplify server operations and to client communications
 * date added: 03/03/2021
 */
module.exports = {
    //server
    sendResponse,
}

const logger = require("./logger");

function sendResponse(res, statusCode, data){
    res.status(statusCode).json(data);
}