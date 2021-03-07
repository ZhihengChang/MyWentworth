const express = require("express");
const morgan = require("morgan");
const path = require("path");

//Routes
const userRoutes = require("./routes/userRoutes");

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
app.use("/api/v1/users", userRoutes);

module.exports = app;