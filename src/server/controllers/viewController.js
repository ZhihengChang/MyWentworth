/**
 * View Controller
 * 
 * used by: *Routes.js
 * descriptions: This controller provides dynamic page rendering
 */
const util = require('../../util/server_utilities');

exports.renderUserLogin = function(req, res){
    util.renderPage(res, 200, 'login', {
        title: "user Login"
    })
}