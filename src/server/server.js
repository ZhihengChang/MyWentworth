const config = require("../config/config.json");

const app = require("./app")

//Start Server
app.listen(config.service.port, ()=>{
    console.log(`Server is now running on port ${config.service.port}`);
});