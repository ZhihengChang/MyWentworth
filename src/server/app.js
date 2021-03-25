// utils
const AppError = require('../util/error/appError');
const Logger = require('../util/logger');
const globalErrorHandler = require('./controllers/errorController');

// app
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require("xss-clean");
const hpp = require("hpp");
const expressLayouts = require("express-ejs-layouts");
const flash = require("connect-flash");
const express = require("express");
const morgan = require("morgan");
const path = require("path");
const logger = new Logger();

// Routes
const userRoutes = require("./routes/userRoutes");
const postRoutes = require("./routes/postRoutes");

const app = express();

// Global Middlewares
app.use(helmet());

if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'));
}

const limiter = rateLimit({
    max: process.env.MAX_REQ_LIMIT,
    windowMs: process.env.LIMIT_DURATION * 60 * 1000, //ms
    message: 'Too many requests from this IP, please try again later!'
});

app.use('/api', limiter);

// Get views path
const parentDir = path.join(__dirname, '../');
const viewDir = path.join(parentDir, 'client/views');

// Set views path
app.set('views', viewDir);

// Set EJS
app.use(expressLayouts);
app.set('view engine', 'ejs'); 

// Serve static files
const clientDir = path.join(parentDir, 'client');
app.use(express.static(clientDir))

// Built-in bodyParser middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json({ limit: '10Kb' }));

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

// Prevent parameter pollution
app.use(
    hpp({
        whitelist: [] // Whitelist certain parameters
    })
);

// Mounting
app.use("/users", userRoutes);
app.use("/posts", postRoutes);

// Error handling 
app.all('*', (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on the server`, 404));
});

app.use(globalErrorHandler);

module.exports = app;