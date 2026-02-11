const express = require("express");
const router = express.Router();

const { register, login } = require("../controllers/authController");
//authController'daki register ve login fonksiyonlarını import ediyoruz, bu fonksiyonlar kullanıcı kayıt ve giriş işlemlerini gerçekleştirecek.

router.post("/register", register);
//POST /auth/register endpoint'i, yeni kullanıcı kaydı için kullanılır. Bu endpoint'e gelen isteklerde register fonksiyonu çalıştırılır.
router.post("/login", login);
//POST /auth/login endpoint'i, kullanıcıların giriş yapması için kullanılır. Bu endpoint'e gelen isteklerde login fonksiyonu çalıştırılır.

module.exports = router;
//router'ı export ediyoruz, böylece app.js'de kullanabiliriz.
