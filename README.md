# My Blog – Backend API

Node.js ve Express kullanılarak geliştirilmiş, güvenlik ve mimari prensipleri gözetilerek tasarlanmış bir blog backend uygulamasıdır.

Bu proje yalnızca CRUD işlemleri yapmak amacıyla değil; gerçek bir production backend yaklaşımını uygulamak amacıyla geliştirilmiştir.

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
- Security Middleware (Helmet, CORS, Rate Limiting)
- Body Size Limitation (DoS koruması)
- Modüler klasör mimarisi

---

## 🔐 Authentication & Authorization

- Kullanıcı kayıt olabilir (`/auth/register`)
- Login sonrası JWT token üretilir (`/auth/login`)
- Protected endpoint’lerde:

Authorization: Bearer TOKEN


- Register sırasında role dışarıdan atanamaz (güvenlik)
- Sadece admin kullanıcılar yeni admin oluşturabilir
- Admin kullanıcılar tüm post ve yorumları yönetebilir

---

## 📝 Post Sistemi

- Giriş yapmış kullanıcı post oluşturabilir
- Post güncelleyebilir
- Post silebilir
- Admin tüm postları yönetebilir
- Postlar pagination ile listelenir

Örnek:

GET /posts?page=1&limit=10


Response içinde:

- post listesi
- toplam post sayısı
- toplam sayfa sayısı
- author username (JOIN ile)

---

## 💬 Comment Sistemi

- Giriş yapmış kullanıcı yorum ekleyebilir
- Yorumlar post bazlı listelenir
- Bir yorumu:
  - Yazan kullanıcı
  - veya admin silebilir

---

## 🛡 Güvenlik Katmanı

- Şifreler bcrypt ile hashlenir
- JWT ile kimlik doğrulama
- Role güvenliği (register'da role atanamaz)
- Ownership kontrolü
- Global error handler
- Express-validator ile request validation
- Helmet ile güvenlik header'ları
- Rate limiting ile brute-force koruması
- CORS yapılandırması
- 10kb body size limiti (DoS koruması)

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
- helmet
- express-rate-limit
- cors

---

## ⚙️ Kurulum

### 1. Repoyu klonla

git clone REPO_LINK


### 2. Proje klasörüne gir

cd backend


### 3. Bağımlılıkları yükle

npm install


### 4. `.env` dosyası oluştur

DB_USER=
DB_HOST=
DB_NAME=
DB_PASSWORD=
DB_PORT=5432
JWT_SECRET=


### 5. Server başlat

node server.js


---

## 📌 Yol Haritası

- Refresh token sistemi
- Logout endpoint
- Token rotation
- Swagger API dokümantasyonu
- Test yazımı (Jest)
- Docker desteği

---