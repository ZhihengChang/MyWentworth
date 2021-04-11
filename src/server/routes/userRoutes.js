const express = require("express");
const userController = require("../controllers/userController");
const authController = require("../controllers/authController");

const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.get('/logout', authController.logout);

router.patch('/updatePassword',
    authController.protect,
    authController.updatePassword
);

router.patch('/updateProfile',
    authController.protect,
    userController.updateProfile
);

router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);

// API
router.route('/')
    .get(userController.getAllUser)
    .post(userController.createUser);

router.route('/:id')
    .get(userController.getUser)
    .patch(userController.updateUser)
    .delete(
        authController.protect,
        authController.restrictTo('admin'),
        userController.deleteUser
    );

module.exports = router;