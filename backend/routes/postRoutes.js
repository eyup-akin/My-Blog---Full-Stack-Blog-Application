
const express = require("express");
const router = express.Router();


const { authenticateToken } = require("../middleware/auth");
const { createPost, getAllPosts } = require("../controllers/postController");
const { getCommentsByPostId } = require("../controllers/commentController");

router.post("/", authenticateToken, createPost);
router.get("/", getAllPosts);


router.get("/:id/comments", getCommentsByPostId);

module.exports = router;