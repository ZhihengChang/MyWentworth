// const express = require("../../node_modules/express");
const express = require("express");
const config = require("../config/config.json");

//Routes
const userRoutes = require("./routes/userRoutes");

const app = express();

//Mounting
app.use("/api/v1/user", userRoutes);

//Start Server
app.listen(config.service.port, ()=>{
    console.log(`Server is now running on port ${config.service.port}`);
});