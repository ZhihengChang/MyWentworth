//Setup Enviorment
const dotenv = require('dotenv');
dotenv.config({ path:  __dirname + '/../config/config.env'});

//Setup logger
const path = require('path');
const Logger = require('../util/logger');
const logger = new Logger(path.basename(__filename));
// logger.details(true); //log details

//DB Connection
const mongoose = require('mongoose');
const DB = process.env.DATABASE.replace(
    '<PASSWORD>', 
    process.env.DB_PASSWORD
);
mongoose.connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
}).then(logger.log("Database connected!").info());

const app = require("./app")

const port = process.env.PORT || 3000;
//Start Server
app.listen(port, ()=>{
    logger.log(`Server is now running on port ${port}`).info();
});