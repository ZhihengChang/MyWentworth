const express = require("express");
const userController = require("../controllers/userController");

const router = express.Router();

// router.use(userController.validateAuthToken);
// router.param("id", userController.validateUserId);

//Routes
router.route('/')
    .get(userController.getAllUser)
    .post(userController.createUser);

router.route('/:id')
    .get(userController.getUser)
    .patch(userController.updateUser)
    .delete(userController.deleteUser);

module.exports = router;