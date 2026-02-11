const pool = require('../db');//veritabanı bağlantısı için pool'u import ediyoruz.

const AppError = require("../utils/AppError");


//tek tip response için 
const { success } = require("../utils/response");


async function createPost(req, res, next) {

    try {

        const { title, content } = req.body;

        if (!title || !content) {
            //return res.status(400).send("Başlık ve içerik zorunludur");
            return next(new AppError("Başlık ve içerik zorunludur"))
        }

        await pool.query(
            "INSERT INTO posts (title, content, author_id) VALUES ($1, $2, $3)",
            [title, content, req.user.id]
        );

        //res.send("Post başarıyla eklendi");
        success(res, { message: "Post başarıyla eklendi" }, 201);

    }catch (err) {
        /*
        console.error(err);
        res.status(500).send("Post eklenemedi");
        */
       next(err);
    }

}

/* limit getiriyoruz buna biladerim bu güncellendi.
async function getAllPosts(req, res) {
    
    const result = await pool.query(
        "SELECT * FROM posts ORDER BY id DESC"
    );

    //res.json(result.rows);
    success(res, result.rows);

}
*/

async function getAllPosts(req, res, next) {

    try {

        //query parametreleri al
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;

        //negatif veya saçma değer kontrolü
        if (page < 1 || limit < 1) {
            return next(new AppError("Page ve limit pozitif olmalı", 400));
        }

        const offset = (page - 1) * limit;

        //toplam post sayısı
        const countResult = await pool.query(
            "SELECT COUNT(*) FROM posts"
        );

        const total = parseInt(countResult.rows[0].count);

        //sayfalı postları al
        const postsResult = await pool.query(
            `
            SELECT 
                posts.id,
                posts.title,
                posts.content,
                posts.created_at,
                users.username
            FROM posts
            JOIN users ON posts.author_id = users.id
            ORDER BY posts.id DESC
            LIMIT $1 OFFSET $2

            `,
            [limit, offset]
        );

        const totalPages = Math.ceil(total / limit);

        success(res, {
            posts: postsResult.rows,
            pagination: {
                page,
                limit,
                total,
                totalPages
            }
        });

    } catch (err) {
        next(err);
    }

}

module.exports = {
    createPost,
    getAllPosts
};