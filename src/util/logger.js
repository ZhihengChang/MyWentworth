/**
 * logger
 * 
 * author: Zhiheng Chang
 * contributor:
 * used by: * file
 * descriptions: custom log
 * date added: 03/03/2021
 */

const path = require("path");

/**
 * log the message in below format:
 * "hh:mm:ss [filename] message"
 * @param {String} message 
 */
exports.log = function(message){
    let ts = new Date();
    let filename = path.basename(__filename);
    let ts_string = `${ts.getHours()}:${ts.getMinutes()}:${ts.getSeconds()}`;
    console.log(`${ts_string} [${filename}] ${message}`);
}