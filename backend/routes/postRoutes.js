
const express = require("express");
const router = express.Router();


const { authenticateToken } = require("../middleware/auth");

//validasyon için
const { postValidation } = require("../validations/postValidation");


const {
    createPost,
    getAllPosts,
    updatePost,
    deletePost,
    getPostById
} = require("../controllers/postController");


const { getCommentsByPostId } = require("../controllers/commentController");

router.post("/", authenticateToken, postValidation, createPost);
router.get("/", getAllPosts);
router.get("/:id", getPostById);
router.put("/:id", authenticateToken, postValidation, updatePost);
router.delete("/:id", authenticateToken, deletePost);


router.get("/:id/comments", getCommentsByPostId);

module.exports = router;