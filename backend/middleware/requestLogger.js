const logger = require("../utils/logger");

function requestLogger(req, res, next) {
    logger.info({
        method: req.method,
        url: req.originalUrl,
        ip: req.ip,
        timestamp: new Date().toISOString()
    });

    next();
}

module.exports = requestLogger;



