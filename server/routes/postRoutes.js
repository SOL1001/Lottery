const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const postController = require('../controllers/postController');
const authMiddleware = require('../middleware/authMiddleware');

// Protect the post creation route
router.post('/', authMiddleware, upload.single('image'), postController.createPost);

// Public route to fetch all posts
router.get('/', postController.getAllPosts);

module.exports = router;
