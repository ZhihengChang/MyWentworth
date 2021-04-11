const express = require("express");
const postController = require("../controllers/postController");
const authController = require("../controllers/authController");

const router = express.Router();

router.route('/create-post',postController)
    .get(postController.getAllPosts)
    .post(authController.protect, postController.createPost);

module.exports = router;