const { body, validationResult } = require("express-validator");
const AppError = require("../utils/AppError");


const postValidation = [

    body("title")
        .notEmpty().withMessage("Başlık zorunludur")
        .isLength({ min: 3 }).withMessage("Başlık en az 3 karakter olmalı"),

    body("content")
        .notEmpty().withMessage("İçerik zorunludur")
        .isLength({ min: 5 }).withMessage("İçerik en az 5 karakter olmalı"),

    (req, res, next) => {
        const errors = validationResult(req);
        if(!errors.isEmpty){
            return next(new AppError(errors.array()[0].msg, 400));
        }

        next();
    }

];

module.exports = { postValidation };