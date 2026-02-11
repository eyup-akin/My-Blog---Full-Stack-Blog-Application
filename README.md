My Blog – Backend

Bu proje, Node.js ve Express kullanarak geliştirdiğim basit ama mimari olarak düzenli bir blog backend uygulamasıdır.

Amacım sadece CRUD yapmak değil; aynı zamanda:

JWT ile authentication

Role bazlı authorization (admin / user)

Global error handling

Tek tip API response yapısı

Pagination sistemi

Modüler klasör mimarisi

gibi gerçek bir backend uygulamasında olması gereken yapıları oturtmaktı.

🔐 Authentication Yapısı

Kullanıcı kayıt olabilir.

Login olduğunda JWT token üretilir.

Protected endpoint’lerde Authorization: Bearer TOKEN yapısı kullanılır.

Admin rolü olan kullanıcılar ekstra yetkilere sahiptir.

📝 Post Sistemi

Giriş yapmış kullanıcı post oluşturabilir.

Postlar sayfalı (pagination) şekilde listelenir.

Toplam post sayısı ve total page bilgisi response içinde döner.

Örnek:

GET /posts?page=1&limit=10

💬 Comment Sistemi

Giriş yapmış kullanıcı yorum ekleyebilir.

Yorumlar post’a göre listelenir.

Bir yorumu:

Yalnızca yazan kişi

veya admin silebilir.

🛠️ Kullanılan Teknolojiler

Node.js

Express

PostgreSQL

JWT

bcrypt

dotenv

⚙️ Kurulum
1) Repoyu klonla
git clone REPO_LINK

2) Backend klasörüne gir
cd backend

3) Paketleri yükle
npm install

4) .env oluştur
DB_USER=
DB_HOST=
DB_NAME=
DB_PASSWORD=
DB_PORT=5432
JWT_SECRET=

5) Server başlat
node server.js

🎯 Bu Projede Özellikle Öğrendiğim Şeyler

Middleware mantığını oturtmak

Error handling’i merkezi hale getirmek

Role kontrolü yapmak

SQL JOIN kullanarak veri birleştirmek

Pagination hesaplamak

Temiz klasör mimarisi kurmak