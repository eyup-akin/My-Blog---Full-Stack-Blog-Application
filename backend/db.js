const { Pool } = require("pg"); // PostgreSQL ile konuşmamı sağlayan kütüphane
//bir nevi import ettik pg kütüphanesini
//pool: bağlantı havuzu oluşturmak için kullanılır

require("dotenv").config();

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});
//bağlantı bilgilerini .env dosyasından alıyoruz
//env dosyasını okumak için dotenv kütüphanesini kullandık
//bu bilgilerle database bağlantısı kuruyoruz


module.exports = pool;
//pool'u diğer dosyalarda kullanabilmek için dışa aktarıyoruz