const express = require("express");

//Routes
const userRoutes = require("./routes/userRoutes");

const app = express();

//Mounting
app.use("/api/v1/user", userRoutes);

module.exports = app;