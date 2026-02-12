const bcrypt = require("bcrypt");
//kütüphaneyi import ediyoruz, parolaları hash'lemek ve doğrulamak için kullanacağız.

const jwt = require("jsonwebtoken");
//kütüphaneyi import ediyoruz, JWT token'ları oluşturmak ve doğrulamak için kullanacağız.

const pool = require("../db");
//veritabanı bağlantısı için pool'u import ediyoruz.

//error handler için 
const AppError = require("../utils/AppError");

//errorları response ederken birlikteilik için
const { success } = require("../utils/response");

//register fonksiyonu, yeni kullanıcı kaydı için kullanılır. Bu fonksiyon, authRoutes.js'deki /register endpoint'inde çağrılacak.
async function register(req, res, next) {

    try {

        const { username, email, password } = req.body;
/*
        if (!username || !email || !password) {
            return next(new AppError("Tüm alanlar zorunludur", 400));
        }
*/
        const existingUser = await pool.query(
            "SELECT * FROM users WHERE email = $1",
            [email]
        );

        if (existingUser.rowCount > 0) {
            return next(new AppError("Bu email zaten kullanılıyor", 400));
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const userRole = "user";


        await pool.query(
            "INSERT INTO users (username, email, password, role) VALUES ($1, $2, $3, $4)",
            [username, email, hashedPassword, userRole]
        );


        //bunu artık kullanmıor-yrmuz
        //res.send("Kullanıcı başarıyla kaydedildi");

        success(res, { message: "Kullanıcı oluşturuldu"}, 201);


    }catch (err) {
        /*
        console.error(err);
        res.status(500).send("Sunucu hatası");
        */
       next(err);
    }

}


//ekleme yaptık global handler için next paramaetresi
//login fonksiyonu, kullanıcıların giriş yapması için kullanılır. Bu fonksiyon, authRoutes.js'deki /login endpoint'inde çağrılacak.
async function login(req, res, next) {

    try {

        const { email, password } = req.body;
/*
        if (!email || !password) {
            return next(new AppError("Email ve parola zorunludur", 400));
        }
*/
        const result = await pool.query(
            "SELECT * FROM users WHERE email = $1",
            [email]
        );

        if (result.rowCount === 0) {
            return next(new AppError("Bu email ile kayıtlı kullanıcı bulunamadı", 400));
        }

        const user = result.rows[0];

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return next(new AppError("Parola yanlış", 400));
        }

       const accessToken = jwt.sign(
            { id: user.id, username: user.username, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "15m" } // kısa süreli
        );

        const refreshToken = jwt.sign(
            { id: user.id },
            process.env.JWT_REFRESH_SECRET,
            { expires: "7d" } // uzun süreli
        );

        await pool.query(
            "INSERT INTO refresh_tokens (user_id, token) VALUES ($1, $2)",
            [user.id, refreshToken]
        );

        success(res, {
            accessToken,
            refreshToken,
            user: {
                id: user.id,
                username: user.username,
                role: user.role
            }
        });


    }catch (err){
        /*
        console.error(err);
        res.status(500).send("Login hatası");
        */
       next(err);
    }

}

async function refresh(req, res, next) {

    try {

        const { refreshToken } = req.body;

        if (!refreshToken) {
            return next(new AppError("Refresh token gerekli", 401));
        }

        //DB'de var mı?
        const tokenCheck = await pool.query(
            "SELECT * FROM refresh_tokens WHERE token = $1",
            [refreshToken]
        );

        if(tokenCheck.rowCount === o){
            return next(new AppError("Geçersiz refresh token", 403));
        }

        //token doğrula
        jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, (err, user) => {
            if(err){
                return next(new AppError("Refresh token geçersiz", 403));
            }

            const newAccessToken = jwt.sign(
                { id: user.id },
                process.env.JWT_SECRET,
                { expiresIn: "15m" }
            );

            success(res, { accessToken: newAccessToken });

        });


    } catch (err) {
        next(err);
    }

}


//logout endpointi
async function logout(req, res, next){

    try {

        const { refreshToken } = req.body;

        await pool.query(
            "DELETE FROM refresh_tokens WHERE token = $1",
            [refreshToken]
        );

        success(res, { message: "Çıkış yapıldı" });

    } catch (err){
        next(err);
    }

}

async function getMe(req, res, next){

    try {

        const userId = req.user.id;

        const result = await pool.query(
            "SELECT id, username, email, role, created_at FROM users WHERE id = $1",
            [userId]
        );

        if(result.rowCount === 0){
            return next(new AppError("Kullanıcı bulunamadı", 404));
        }

        success(res, result.rows[0]);

    } catch (err) {
        next(err);
    }


}


//admin oluşturmak için ayrı bir endpoint
async function createAdmin(req , res, next){

    try {

        const { username, email, password } = req.body;
/*
        if(!username || !email || !password) {
            return next(new AppError("Tüm alanlar zorunludur", 400));
        }
*/
        const existingUser = await pool.query(
            "SELECT * FROM users WHERE email = $1",
             [email]
        );

        if(existingUser.rowCount > 0) {
            return next(new AppError("Bu email zaten kullanılıyor", 400));
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await pool.query(
            "INSERT INTO users (username, email, password, role) VALUES ($1, $2, $3, $4)",
            [username, email, hashedPassword, "admin"]
        );

        success(res, { message: "Admin oluşturuldu" }, 201);


    } catch (err){
        next(err);
    }

}

module.exports = {
    register,
    login,
    createAdmin,
    refresh,
    logout,
    getMe
};
