//utils
const AppError = require('../util/error/appError');
const Logger = require('../util/logger');
const globalErrorHandler = require('./controllers/errorController');

//app
const express = require("express");
const morgan = require("morgan");
const path = require("path");
const logger = new Logger();

//Routes
const userRoutes = require("./routes/userRoutes");
const postRoutes = require("./routes/postRoutes");

const app = express();

//Get views path
const parentDir = path.join(__dirname, '../');
const viewDir = path.join(parentDir, 'client/views');
//Set views path
app.set('views', viewDir);
//Set EJS
app.set('view engine', 'ejs'); 

//Mounting
app.use(morgan("dev"))
app.use(express.json());
app.use("/users", userRoutes);
app.use("/posts", postRoutes);

//Error handling
app.all('*', (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on the server`, 404));
});

app.use(globalErrorHandler);

module.exports = app;