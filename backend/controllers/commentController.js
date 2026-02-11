const pool = require('../db');//veritabanı bağlantısı için pool'u import ediyoruz.
const { get } = require('../routes/authRoutes');

//bunu sonradan ekledik 
//error handlerer 
const AppError = require("../utils/AppError")

//tek tip response için
const { success } = require("../utils/response");


//fonksiyon imzasına next sonradan eklendi errorr handler için 
async function addComment(req, res, next) {
    try {
        const { post_id, content } = req.body;

        /*
        if (!post_id || !content) {
            return res.status(400).send("Post ID ve içerik zorunludur");
        }
        */

        //error handler kullanımı 
        if (!post_id || !content) {
            return next(new AppError("Post ID ve içerik zorunludur", 400));
        }


        const postResult = await pool.query(
            "SELECT id FROM posts WHERE id = $1",
            [post_id]
        );

        if (postResult.rowCount === 0) {
            return next(new AppError("Post bulunamadı", 404));
        }

        await pool.query(
            "INSERT INTO comments (post_id, author_id, content) VALUES ($1, $2, $3)",
            [post_id, req.user.id, content]
        );

        //res.send("Yorum başarıyla eklendi");
        success(res, {message: "Yorum başarıyla eklendi"}, 201);

    } catch (err) {
        /*
        console.error(err);
        res.status(500).send("Yorum eklenemedi");
        */
       //error handlerden sonra 
       next(err);
    }
}

async function getCommentsByPostId(req, res, next) {

    try {

        const postId = req.params.id;

        //postun var olup olmadığını kontrol ediyoruz.
        const postCheck = await pool.query(
            "SELECT id FROM posts WHERE id = $1",
            [postId]
        );

        if (postCheck.rowCount === 0) {
            return next(new AppError("Post bulunamadı", 404));
        }

        //postId'ye ait yorumları getiriyoruz.
        const commentResult = await pool.query(
             `
            SELECT 
                comments.id,
                comments.content,
                comments.created_at,
                users.username
            FROM comments
            JOIN users ON comments.author_id = users.id
            WHERE comments.post_id = $1
            ORDER BY comments.created_at ASC
            `,
            [postId]
        );

        //res.json(commentResult.rows);
        success(res, commentResult.rows);


    } catch (err){
        next(err);
    }

}

async function deleteComment(req, res, next) {
    
    try{

        const commentId = req.params.id;

        //yorum var mı?
        const commentCheck = await pool.query(
            "SELECT author_id FROM comments WHERE id = $1",
            [commentId]
        );

        if (commentCheck.rowCount === 0){
            return next(new AppError("Yorum bulunamadı", 404));
        }

        const commentAuthorId = commentCheck.rows[0].author_id;

        // ownership veya admin kontrol
        if(
            req.user.role !== "admin" &&
            req.user.id !== commentAuthorId
        ){
            return next(new AppError("Bu yorumu silme yetkin yok", 403));
        }

        //sil
        await pool.query(
            "DELETE FROM comments WHERE id = $1",
            [commentId]
        );

        //res.send("Yorum silindi");
        success(res, { message: "Yorum silindi" });


    }catch(err){
        next(err);
    }

}

module.exports = {
    addComment,
    getCommentsByPostId,
    deleteComment
};