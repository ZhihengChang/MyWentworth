const express = require("express");
const morgan = require("morgan");

//Routes
const userRoutes = require("./routes/userRoutes");

const app = express();

//Set EJS
app.set('view engine', 'ejs'); 

//Mounting
app.use(morgan("dev"))
app.use(express.json());
app.use("/api/v1/user", userRoutes);

module.exports = app;