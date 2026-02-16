const bcrypt = require("bcrypt");
//kÃ¼tÃ¼phaneyi import ediyoruz, parolalarÄ± hash'lemek ve doÄŸrulamak iÃ§in kullanacaÄŸÄ±z.

const jwt = require("jsonwebtoken");
//kÃ¼tÃ¼phaneyi import ediyoruz, JWT token'larÄ± oluÅŸturmak ve doÄŸrulamak iÃ§in kullanacaÄŸÄ±z.

const pool = require("../db");
//veritabanÄ± baÄŸlantÄ±sÄ± iÃ§in pool'u import ediyoruz.

//error handler iÃ§in 
const AppError = require("../utils/AppError");

//errorlarÄ± response ederken birlikteilik iÃ§in
const { success } = require("../utils/response");

//register fonksiyonu, yeni kullanÄ±cÄ± kaydÄ± iÃ§in kullanÄ±lÄ±r. Bu fonksiyon, authRoutes.js'deki /register endpoint'inde Ã§aÄŸrÄ±lacak.
async function register(req, res, next) {

    try {

        const { username, email, password } = req.body;
        /*
                if (!username || !email || !password) {
                    return next(new AppError("TÃ¼m alanlar zorunludur", 400));
                }
        */
        const existingUser = await pool.query(
            "SELECT * FROM users WHERE email = $1",
            [email]
        );

        if (existingUser.rowCount > 0) {
            return next(new AppError("Bu email zaten kullanÄ±lÄ±yor", 400));
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const userRole = "user";


        await pool.query(
            "INSERT INTO users (username, email, password, role) VALUES ($1, $2, $3, $4)",
            [username, email, hashedPassword, userRole]
        );


        //bunu artÄ±k kullanmÄ±or-yrmuz
        //res.send("KullanÄ±cÄ± baÅŸarÄ±yla kaydedildi");

        success(res, { message: "Kullanıcı oluşturuldu" }, 201);


    } catch (err) {
        /*
        console.error(err);
        res.status(500).send("Sunucu hatasÄ±");
        */
        next(err);
    }

}


//ekleme yaptÄ±k global handler iÃ§in next paramaetresi
//login fonksiyonu, kullanÄ±cÄ±larÄ±n giriÅŸ yapmasÄ± iÃ§in kullanÄ±lÄ±r. Bu fonksiyon, authRoutes.js'deki /login endpoint'inde Ã§aÄŸrÄ±lacak.
// login fonksiyonu
async function login(req, res, next) {
    try {

        const { email, password } = req.body;

        const result = await pool.query(
            "SELECT * FROM users WHERE email = $1",
            [email]
        );

        if (result.rowCount === 0) {
            return next(new AppError("Bu email ile kayÄ±tlÄ± kullanÄ±cÄ± bulunamadÄ±", 400));
        }

        const user = result.rows[0];

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return next(new AppError("Parola yanlÄ±ÅŸ", 400));
        }

        const accessToken = jwt.sign(
            { id: user.id, username: user.username, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "15m" }
        );

        const refreshToken = jwt.sign(
            { id: user.id },
            process.env.JWT_REFRESH_SECRET,
            { expiresIn: "7d" }
        );

        await pool.query(
            "INSERT INTO refresh_tokens (user_id, token) VALUES ($1, $2)",
            [user.id, refreshToken]
        );

        // REFRESH TOKEN COOKIE OLARAK GÖNDER
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: true, // Render https üzerinden hizmet veriyor, localde de secure true sorun olmaz genelde ama false da olabilir
            sameSite: "none", // Cross-site cookie için gerekli
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        success(res, {
            accessToken,
            user: {
                id: user.id,
                username: user.username,
                role: user.role
            }
        });

    } catch (err) {
        next(err);
    }
}

async function refresh(req, res, next) {

    try {

        //tokeni cookielerden okuyoruz
        const refreshToken = req.cookies.refreshToken;

        if (!refreshToken) {
            return next(new AppError("Refresh token gerekli", 401));
        }

        //DB'de var mı?
        const tokenCheck = await pool.query(
            "SELECT * FROM refresh_tokens WHERE token = $1",
            [refreshToken]
        );

        if (tokenCheck.rowCount === 0) {
            return next(new AppError("Geçersiz refresh token", 403));
        }

        //token doğrula
        jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, async (err, decoded) => {
            if (err) {
                return next(new AppError("Refresh token geçersiz", 403));
            }

            // User bilgisini DB'den çek
            const userResult = await pool.query(
                "SELECT id, username, email, role FROM users WHERE id = $1",
                [decoded.id]
            );

            if (userResult.rowCount === 0) {
                return next(new AppError("Kullanıcı bulunamadı", 404));
            }

            const user = userResult.rows[0];

            const newAccessToken = jwt.sign(
                { id: user.id, username: user.username, role: user.role },
                process.env.JWT_SECRET,
                { expiresIn: "15m" }
            );

            success(res, {
                accessToken: newAccessToken,
                user: {
                    id: user.id,
                    username: user.username,
                    role: user.role
                }
            });

        });


    } catch (err) {
        next(err);
    }

}


//logout endpointi
async function logout(req, res, next) {

    try {

        const refreshToken = req.cookies.refreshToken;

        await pool.query(
            "DELETE FROM refresh_tokens WHERE token = $1",
            [refreshToken]
        );

        res.clearCookie("refreshToken")

        success(res, { message: "Çıkış yapıldı" });

    } catch (err) {
        next(err);
    }

}

async function getMe(req, res, next) {

    try {

        const userId = req.user.id;

        const result = await pool.query(
            "SELECT id, username, email, role, created_at FROM users WHERE id = $1",
            [userId]
        );

        if (result.rowCount === 0) {
            return next(new AppError("KullanÄ±cÄ± bulunamadÄ±", 404));
        }

        success(res, result.rows[0]);

    } catch (err) {
        next(err);
    }


}


//admin oluÅŸturmak iÃ§in ayrÄ± bir endpoint
async function createAdmin(req, res, next) {

    try {

        const { username, email, password } = req.body;
        /*
                if(!username || !email || !password) {
                    return next(new AppError("TÃ¼m alanlar zorunludur", 400));
                }
        */
        const existingUser = await pool.query(
            "SELECT * FROM users WHERE email = $1",
            [email]
        );

        if (existingUser.rowCount > 0) {
            return next(new AppError("Bu email zaten kullanÄ±lÄ±yor", 400));
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await pool.query(
            "INSERT INTO users (username, email, password, role) VALUES ($1, $2, $3, $4)",
            [username, email, hashedPassword, "admin"]
        );

        success(res, { message: "Admin oluÅŸturuldu" }, 201);


    } catch (err) {
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