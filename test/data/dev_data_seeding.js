/**
 * dev data seeding script
 * 
 * descriptions: import/delete all development data at once
 * usage: from command line, type: node test/data/dev_data_seeding.js --[action]
 * actions: 
 *   --import: import all data
 *   --delete: delete all data
 */

const fs = require('fs');
const dotenv = require('dotenv');
const path = require('path');
const Logger = require('../../src/util/logger');
const User = require('../../src/server/models/userModel');

const logger = new Logger(path.basename(__filename));
dotenv.config({ path:  __dirname + '/../../src/config/config.env'});


//Connecting to db
const mongoose = require('mongoose');
const DB = process.env.DATABASE.replace(
    '<PASSWORD>', 
    process.env.DB_PASSWORD
);
mongoose.connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
})
.then(logger.log("Database connected!").info());

//Get data
const users = JSON.parse(
    fs.readFileSync(`${__dirname}/users-data.json`, 'utf-8')
);

//Insert all data to DB
const importData = async function(){
    try{
        await User.create(users);
        logger.log('Data successfully loaded').info();
    }catch(err){
        logger.log(err).err();
    }
    process.exit();
}

//Delete all data from DB
const deleteData = async function(){
    try{
        await User.deleteMany();
        logger.log('Data successfully deleted').info();
        process.exit();
    }catch(err){
        logger.log(err).err();
    }
    process.exit();
}

//geting cl arguments
const _action = process.argv[2];

if(_action === '--import') importData();
else if(_action === '--delete') deleteData();
