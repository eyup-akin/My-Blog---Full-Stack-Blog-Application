const pool = require('../db');//veritabanı bağlantısı için pool'u import ediyoruz.

const AppError = require("../utils/AppError");


//tek tip response için 
const { success } = require("../utils/response");


async function createPost(req, res, next) {

    try {

        const { title, content } = req.body;
        /*
                if (!title || !content) {
                    //return res.status(400).send("Başlık ve içerik zorunludur");
                    return next(new AppError("Başlık ve içerik zorunludur"))
                }
        */
        const newPost = await pool.query(
            "INSERT INTO posts (title, content, author_id) VALUES ($1, $2, $3) RETURNING id",
            [title, content, req.user.id]
        );

        //res.send("Post başarıyla eklendi");
        success(res, {
            message: "Post başarıyla eklendi",
            postId: newPost.rows[0].id
        }, 201);

    } catch (err) {
        /*
        console.error(err);
        res.status(500).send("Post eklenemedi");
        */
        next(err);
    }

}

// limit + search + filter özelliği olan get metodu
async function getAllPosts(req, res, next) {
    try {

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const search = req.query.search;
        const author = req.query.author;
        //const sort = req.query.sort || "created_at";
        //sql injectiona karşı
        const allowedSortFields = ["created_at", "title"];
        const sort = allowedSortFields.includes(req.query.sort)
            ? req.query.sort
            : "created_at";

        const order = req.query.order === "asc" ? "ASC" : "DESC";

        if (page < 1 || limit < 1) {
            return next(new AppError("Page ve limit pozitif olmalı", 400));
        }

        const offset = (page - 1) * limit;

        // Dinamik WHERE oluşturma
        let whereClauses = [];
        let values = [];
        let index = 1;

        if (search) {
            whereClauses.push(`posts.title ILIKE $${index}`);
            values.push(`%${search}%`);
            index++;
        }

        if (author) {
            whereClauses.push(`posts.author_id = $${index}`);
            values.push(author);
            index++;
        }

        const whereSQL = whereClauses.length > 0
            ? `WHERE ${whereClauses.join(" AND ")}`
            : "";

        // Toplam count
        const countQuery = `
            SELECT COUNT(*)
            FROM posts
            JOIN users ON posts.author_id = users.id
            ${whereSQL}
        `;

        const countResult = await pool.query(countQuery, values);
        const total = parseInt(countResult.rows[0].count);

        // Postları çek
        const postsQuery = `
            SELECT
                posts.id,
                posts.title,
                posts.content,
                posts.created_at,
                users.username
            FROM posts
            JOIN users ON posts.author_id = users.id
            ${whereSQL}
            ORDER BY posts.${sort} ${order}
            LIMIT $${index} OFFSET $${index + 1}
        `;

        values.push(limit, offset);

        const postsResult = await pool.query(postsQuery, values);

        success(res, {
            posts: postsResult.rows,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit)
            }
        });

    } catch (err) {
        next(err);
    }
}




//post güncelleme için endpointli fonksiyon
async function updatePost(req, res, next) {

    try {

        const postId = req.params.id;
        const { title, content } = req.body;
        /*
                if(!title || !content){
                    return next(new AppError("Başlık ve içerik zorunludur", 400));
                }
        */
        const postCheck = await pool.query(
            "SELECT author_id FROM posts WHERE id = $1",
            [postId]
        );

        if (postCheck.rowCount === 0) {
            return next(new AppError("Post bulunamadı", 404));
        }

        const postAuthorId = postCheck.rows[0].author_id;

        if (req.user.role !== "admin" &&
            req.user.id !== postAuthorId
        ) {
            return next(new AppError("Bu postu güncelleme yetkin yok", 403));
        }

        await pool.query(
            "UPDATE posts SET title = $1, content = $2 WHERE id = $3",
            [title, content, postId]
        );

        success(res, { message: "Post güncellendi" });


    } catch (err) {
        next(err);
    }

}


//post silme
async function deletePost(req, res, next) {
    try {
        const postId = req.params.id;

        const postCheck = await pool.query(
            "SELECT author_id FROM posts WHERE id = $1",
            [postId]
        );

        if (postCheck.rowCount === 0) {
            return next(new AppError("Post bulunamadı", 404));
        }

        const postAuthorId = postCheck.rows[0].author_id;

        if (
            req.user.role !== "admin" &&
            req.user.id !== postAuthorId
        ) {
            return next(new AppError("Bu postu silme yetkin yok", 403));
        }

        await pool.query(
            "DELETE FROM posts WHERE id = $1",
            [postId]
        );

        success(res, { message: "Post silindi" });

    } catch (err) {
        next(err);
    }
}


async function getPostById(req, res, next) {
    try {
        const postId = req.params.id;

        const postQuery = `
            SELECT 
                posts.id, 
                posts.title, 
                posts.content, 
                posts.created_at, 
                users.username,
                users.id as author_id
            FROM posts
            JOIN users ON posts.author_id = users.id
            WHERE posts.id = $1
        `;

        const result = await pool.query(postQuery, [postId]);

        if (result.rowCount === 0) {
            return next(new AppError("Post bulunamadı", 404));
        }

        success(res, { post: result.rows[0] });

    } catch (err) {
        next(err);
    }
}


module.exports = {
    createPost,
    getAllPosts,
    updatePost,
    deletePost,
    getPostById
};