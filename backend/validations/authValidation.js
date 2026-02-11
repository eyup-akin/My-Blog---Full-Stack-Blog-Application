const { body, validationResult } = require("express-validator");
const AppError = require("../utils/AppError");


//kayıt olmak için validayson süreci
const registerValidation = [
    body("username")
        .notEmpty().withMessage("Kullanıcı adı zorunludur")
        .isLength({ min: 3 }).withMessage("Kullanıcı adı en az 3 karakter olmalı"),

    body("email")
        .notEmpty().withMessage("Email zorunludur")
        .isEmail().withMessage("Geçerli bir email giriniz"),

     body("password")
        .notEmpty().withMessage("Parola zorunludur")
        .isLength({ min: 6 }).withMessage("Parola en az 6 karakter olmalı"),

    (req, res, next) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return next(new AppError(errors.array()[0].msg, 400));
        }

        next();
    }
];


//giriş yapmak için validasyon süreci
const loginValidation = [
    body("email")
        .notEmpty().withMessage("Email zorunludur")
        .isEmail().withMessage("Geçerli bir email giriniz"),

    body("password")
        .notEmpty().withMessage("Parola zorunludur"),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return next(new AppError(errors.array()[0].msg, 400));
        }
        next();
    }
];

module.exports = {
    registerValidation,
    loginValidation
};