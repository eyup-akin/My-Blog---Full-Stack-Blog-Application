function errorHandler(err, req, res, next) {
    console.error("ERROR: ", err);

    const statusCode = err.statusCode || 500;
    const message = err.message || "Sunucu hatası";

    res.status(statusCode).json({
        status: err.status || "error",
        message
    });

}

module.exports = errorHandler;