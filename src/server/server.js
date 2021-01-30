const http = require('http');
const config = require('../config/config.json');

let server = http.createServer((request, response) => {
    //code handle request
})
server.listen(config.service.port);
console.log("Server Started");




