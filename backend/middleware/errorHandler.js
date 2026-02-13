const logger = require("../utils/logger");


function errorHandler(err, req, res, next) {
    //console.error("ERROR: ", err);
    logger.error({
       message: err.message,
       statusCode: err.statusCode,
       stack: err.stack 
    });

    const statusCode = err.statusCode || 500;
    const message = err.message || "Sunucu hatası";

    res.status(statusCode).json({
        status: err.status || "error",
        message
    });

}

module.exports = errorHandler;