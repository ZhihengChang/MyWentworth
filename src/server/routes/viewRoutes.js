const express = require('express');
const viewController = require('../controllers/viewController');
const authController = require('../controllers/authController');

const router = express.Router();
router.use(authController.isLoggedIn);

router.get('/signup', viewController.renderUserSignup);
router.get('/login', viewController.renderUserLogin);
router.get('/', viewController.renderUserHome);

module.exports = router;