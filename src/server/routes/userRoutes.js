const express = require("express");
const userController = require("../controllers/userController");

const router = express.Router();

//Routes
router.route("/login").get(userController.handleUserLogin);

module.exports = router;