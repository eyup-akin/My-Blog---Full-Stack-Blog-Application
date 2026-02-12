const express = require("express");
const router = express.Router();

const { authenticateToken } = require("../middleware/auth");
const { 
    addComment,
    deleteComment
} = require("../controllers/commentController");


//validasyon için
const { commentValidation } = require("../validations/commentValidation");



//yorum ekleme endpoint'i, bu endpoint'e gelen isteklerde önce authenticateToken middleware'i çalıştırılır, eğer token geçerliyse addComment fonksiyonu çalıştırılır.
router.post("/", authenticateToken, commentValidation, addComment);
router.delete("/:id", authenticateToken, deleteComment);

module.exports = router;
//router'ı export ediyoruz, böylece app.js'de kullanabiliriz.
