require("dotenv").config();
//dotenv kütüphanesini import ediyoruz, .env dosyasındaki çevresel değişkenleri kullanmak için.
const express = require("express");
//express kütüphanesini import ediyoruz, web sunucusu oluşturmak için kullanacağız.
const app = express();

app.use(express.json());
//gelen isteklerdeki JSON verilerini otomatik olarak ayrıştırmak için express.json() middleware'ini kullanıyoruz.

const authRoutes = require("./routes/authRoutes");
//authRoutes'u import ediyoruz, bu dosyada kullanıcı kayıt ve giriş işlemleriyle ilgili endpoint'ler tanımlanacak.
const postRoutes = require("./routes/postRoutes");
//postRoutes'u import ediyoruz, bu dosyada blog postlarıyla ilgili endpoint'ler tanımlanacak.


const commentRoutes = require("./routes/commentRoutes");
//commentRoutes'u import ediyoruz, bu dosyada yorumlarla ilgili endpoint'ler tanımlanacak.

const errorHandler = require("./middleware/errorHandler");


app.get("/", (req, res) => {
    res.send("Backend çalışıyor");
});

app.use("/auth" , authRoutes);
//authRoutes'u /auth path'i altında kullanıyoruz, böylece auth ile başlayan endpoint'ler authRoutes'ta tanımlanacak.
app.use("/posts", postRoutes);
//postRoutes'u /posts path'i altında kullanıyoruz, böylece posts ile başlayan endpoint'ler postRoutes'ta tanımlanacak.

app.use("/comments", commentRoutes);
//commentRoutes'u /comments path'i altında kullanıyoruz, böylece comments ile başlayan endpoint'ler commentRoutes'ta tanımlanacak.

app.use(errorHandler);


const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});