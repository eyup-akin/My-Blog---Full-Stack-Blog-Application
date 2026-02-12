const express = require("express");
const router = express.Router();

const { register, login, createAdmin } = require("../controllers/authController");
//authController'daki register ve login fonksiyonlarını import ediyoruz, bu fonksiyonlar kullanıcı kayıt ve giriş işlemlerini gerçekleştirecek.

//admin kaydı için
const { authenticateToken, adminOnly } = require("../middleware/auth");

//validasyon için
const { registerValidation, loginValidation } = require("../validations/authValidation");


//refresh token ve logout için
const { refresh, logout } = require("../controllers/authController");

router.post("/refresh", refresh);
router.post("/logout", logout);


//admin kaydı için router
router.post("/create-admin", authenticateToken, adminOnly, createAdmin);

//router.post("/register", register);
//validasyonlu hali
router.post("/register",registerValidation, register);
//POST /auth/register endpoint'i, yeni kullanıcı kaydı için kullanılır. Bu endpoint'e gelen isteklerde register fonksiyonu çalıştırılır.
router.post("/login",loginValidation, login);
//POST /auth/login endpoint'i, kullanıcıların giriş yapması için kullanılır. Bu endpoint'e gelen isteklerde login fonksiyonu çalıştırılır.

module.exports = router;
//router'ı export ediyoruz, böylece app.js'de kullanabiliriz.
