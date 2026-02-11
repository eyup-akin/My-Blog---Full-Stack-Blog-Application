//bu dosyayı yazılma amacı 
//başarı ve hata mezajlarını tek bir türde söylemek
//bu sayede karmaşıklık önlenmiş oluyor.

//burada parametrenin içinde direkt = 200 yazmanın
//sebebi eğer bir kod gönderilmezse default bu oluypr biladerim
function success(res, data, statusCode = 200){
    res.status(statusCode).json({
        status: "success",
        data
    });
}

function fail(res, message, statusCode = 400){
    res.status(statusCode).json({
        status: "fail",
        message
    });
}

module.exports = {
    success,
    fail
};