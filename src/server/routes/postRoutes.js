const express = require("express");
const postController = require("../controllers/postController");
const authController = require("../controllers/authController");

const router = express.Router();

router.route('/')
    .get(postController.getAllPosts);

router.route('/like')
    .post(authController.protect, postController.likePost);

router.route('/create')
    .post(authController.protect, postController.createPost);

module.exports = router;