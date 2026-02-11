# My Blog – Backend API

Bu proje, Node.js ve Express kullanılarak geliştirilmiş, production yaklaşımı benimsenmiş bir blog backend uygulamasıdır.

Amaç yalnızca CRUD işlemleri yapmak değil; güvenli, modüler ve sürdürülebilir bir backend mimarisi kurmaktır.

---

## 🚀 Özellikler

- JWT Authentication
- Role-based Authorization (admin / user)
- Protected Routes
- Ownership Control (post & comment)
- Global Error Handling
- Standardized API Response Format
- Pagination Support
- SQL JOIN ile ilişkili veri çekme
- Request Validation Layer (express-validator)
- Modüler klasör mimarisi

---

## 🔐 Authentication & Authorization

- Kullanıcı kayıt olabilir (register)
- Login sonrası JWT token üretilir
- Protected endpoint’lerde `Authorization: Bearer TOKEN` kullanılır
- Sadece admin kullanıcılar yeni admin oluşturabilir
- Admin kullanıcılar tüm post ve yorumları yönetebilir

---

## 📝 Post Sistemi

- Giriş yapmış kullanıcı post oluşturabilir
- Postlar pagination ile listelenir

Örnek:
GET /posts?page=1&limit=10


Response içinde:
- post listesi
- toplam post sayısı
- toplam sayfa sayısı

Postlar kullanıcı bilgisi ile birlikte JOIN kullanılarak döner.

---

## 💬 Comment Sistemi

- Giriş yapmış kullanıcı yorum ekleyebilir
- Yorumlar post bazlı listelenir
- Bir yorumu:
  - Yazan kullanıcı
  - veya admin silebilir

---

## 🛡 Güvenlik Yapısı

- Şifreler bcrypt ile hashlenir
- JWT ile kimlik doğrulama
- Role güvenliği (register'da role dışarıdan atanamaz)
- Ownership kontrolü
- Global error handler
- Express-validator ile request validation

---

## 🧱 Proje Mimarisi

controllers/
middleware/
routes/
utils/
validations/


Katmanlı ve ayrık sorumluluk prensibi uygulanmıştır.

---

## 🛠️ Kullanılan Teknolojiler

- Node.js
- Express
- PostgreSQL
- JWT
- bcrypt
- dotenv
- express-validator

---

## ⚙️ Kurulum

### 1. Repoyu klonla
git clone REPO_LINK


### 2. Proje klasörüne gir
cd backend


### 3. Bağımlılıkları yükle
npm install


### 4. .env dosyası oluştur
DB_USER=
DB_HOST=
DB_NAME=
DB_PASSWORD=
DB_PORT=5432
JWT_SECRET=


### 5. Server başlat
node server.js


---

## 🎯 Bu Projede Kazanılan Yetkinlikler

- Middleware mimarisi
- Merkezi error handling
- Role bazlı yetkilendirme
- Ownership kontrolü
- SQL JOIN kullanımı
- Pagination hesaplama
- Validation katmanı kurma
- Modüler backend mimarisi

---

## 📌 Gelecek Geliştirmeler

- Refresh token sistemi
- Rate limiting
- Helmet güvenlik başlıkları
- API dokümantasyonu (Swagger)
- Test yazımı (Jest)

---