//Set Enviorment
const dotenv = require('dotenv');
dotenv.config({ path:  __dirname + '/../config/config.env'});
const app = require("./app")

const port = process.env.PORT || 3000;
//Start Server
app.listen(port, ()=>{
    console.log(`Server is now running on port ${port}`);
});