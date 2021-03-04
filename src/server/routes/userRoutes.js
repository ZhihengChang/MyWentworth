const express = require("express");
const userController = require("../controllers/userController");

const router = express.Router();

// router.use(userController.validateAuthToken);
router.param("id", userController.validateUserId);

//Routes
router.route("/:id").get(userController.getUser);
router.route("/login").get(userController.handleUserLogin);
router.route("/update").post(userController.updateUser);

module.exports = router;