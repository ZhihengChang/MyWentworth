// const express = require("../../node_modules/express");
const express = require("express");
const config = require("../config/config.json");

const app = express();

app.listen(config.service.port, ()=>{
    console.log(`Server is now running on port ${config.service.port}`);
});