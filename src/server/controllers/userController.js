//Controller Functions
exports.handleUserLogin = function(req, res){
    res.status(200).json({
        message: `User Login Successful`
    });
}