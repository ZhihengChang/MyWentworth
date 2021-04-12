const express = require("express");
const postController = require("../controllers/postController");
const authController = require("../controllers/authController");

const router = express.Router();

router.route('/')
    .get(postController.getAllPosts)
    .post(authController.protect, postController.createPost);

router.route('/like')
    .post(authController.protect, postController.likePost);

module.exports = router;