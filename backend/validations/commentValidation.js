const { body, validationResult } = require("express-validator");
const AppError = require("../utils/AppError");



const commentValidation = [

    body("post_id")
        .notEmpty().withMessage("Post ID zorunludur")
        .isInt().withMessage("Post ID sayı olmalıdır"),

    body("content")
        .notEmpty().withMessage("Yorum içeriği zorunludur")
        .isLength({ min: 2 }).withMessage("Yorum en az 2 karakter olmalı"),

    
    (req, res, next) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return next(new AppError(errors.array()[0].msg, 400));
        }

        next();
    }

];

module.exports = {
    commentValidation
};