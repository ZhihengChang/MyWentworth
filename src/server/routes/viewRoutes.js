const express = require('express');
const viewController = require('../controllers/viewController')

const router = express.Router();

router.get('/', viewController.renderUserLogin);
router.get('/home', viewController.renderUserHome);

module.exports = router;