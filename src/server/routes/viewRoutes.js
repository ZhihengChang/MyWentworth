const express = require('express');
const viewController = require('../controllers/viewController');
const authController = require('../controllers/authController');
const userController = require('../controllers/userController');

const router = express.Router();

router.use(authController.isLoggedIn);
router.get('/signup', authController.isLoggedIn, viewController.renderUserSignup);
router.get('/login', authController.isLoggedIn, viewController.renderUserLogin);
router.get('/', authController.isLoggedIn, viewController.renderUserHome);

router.get('/me', 
    authController.protect, 
    userController.getStudent, 
    viewController.renderUserProfile
);

module.exports = router;