const jwt = require('jsonwebtoken');
//kütüphaneyi import ediyoruz, JWT işlemleri için kullanacağız.

const AppError = require("../utils/AppError");


/*

 Bu middleware, gelen isteklerde Authorization 
header'ında bulunan JWT token'ını doğrular. 
Eğer token geçerliyse, token içindeki kullanıcı 
bilgilerini req.user'a atar ve bir sonraki middleware'e geçer. 
Eğer token yoksa veya geçersizse 
uygun HTTP durum kodlarıyla hata mesajları döner.

*/


//adminOnly middleware'i, sadece admin rolüne sahip kullanıcıların erişebileceği endpoint'ler için kullanılır.
function authenticateToken(req, res, next) {

    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return next(new AppError("Token yok", 401));
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
        return next(new AppError("Token yok", 401));
    }

    //token'ı doğruluyoruz, eğer geçerliyse kullanıcı bilgilerini req.user'a atıyoruz.
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {

        if (err) {
            return next(new AppError("Token geçersiz", 403));
        }

        req.user = user;

        next();

    });


}

//adminOnly middleware'i, sadece admin rolüne sahip kullanıcıların erişebileceği endpoint'ler için kullanılır.
function adminOnly(req, res, next) {
    if (req.user.role !== "admin") {
        return next(new AppError("Yönetici yetkisi gerekli", 403));
    }

    next();
}

module.exports = {
    authenticateToken,
    adminOnly
};