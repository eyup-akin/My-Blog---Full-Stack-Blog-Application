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

        const token = jwt.sign(
            { id: user.id, username: user.username, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        
        //bu da gitti biladerim
        //res.json({ token });

        //success(res, { token });

        success(res, {
            token,
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
    createAdmin
};
