# Ice Blue Blog - Full Stack Application

[![Turkish](https://img.shields.io/badge/Language-Turkish-red)](#türkçe) [![English](https://img.shields.io/badge/Language-English-blue)](#english)

<a name="english"></a>
## 🇬🇧 English

This is a modern, full-stack blog application featuring a premium "Ice Blue" user interface, robust authentication, and a complete content management system. Built with the **PERN stack** (PostgreSQL, Express, React, Node.js).

### 🚀 Features

#### **Frontend (User Interface)**
- **Ice Blue Theme**: A clean, modern aesthetic using soothing blue tones and glassmorphism effects.
- **Responsive Design**: Optimized for all devices (mobile, tablet, desktop).
- **Authentication Pages**: Beautifully designed Login and Register pages with form validation.
- **Interactive Components**:
    - **Landing Page**: Engaging hero section for guest users.
    - **Post Feed**: Card-based layout for browsing articles.
    - **Post Detail**: Typography-focused reading experience with a polished comment section.

#### **Backend (API)**
- **Authentication**: JWT-based secure authentication with bcrypt password hashing.
- **CRUD Operations**: Complete Create, Read, Update, Delete functionality for posts and comments.
- **Security**: Helper middleware for security headers (Helmet), CORS configuration, and rate limiting.
- **Database**: Relational data modeling with PostgreSQL.

### 🛠 Tech Stack

#### **Frontend**
- **React**: Component-based UI library.
- **Vite**: Next-generation frontend tooling.
- **Tailwind CSS**: Utility-first CSS framework for styling.
- **Axios**: Promise-based HTTP client for API requests.
- **React Router**: Declarative routing for React.

#### **Backend**
- **Node.js**: JavaScript runtime environment.
- **Express**: Fast, unopinionated web framework for Node.js.
- **PostgreSQL**: Open source object-relational database system.
- **JWT (JSON Web Token)**: Compact, URL-safe means of representing claims to be transferred between two parties.

### ⚙️ Installation & Setup

#### Prerequisites
- Node.js (v14+)
- PostgreSQL installed and running locally.

#### 1. Database Setup
Create a PostgreSQL database named `blog_db` (or updated in `.env`).
```sql
CREATE DATABASE blog_db;
```

#### 2. Backend Setup
Navigate to the `backend` directory and install dependencies:
```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory with the following variables:
```env
DB_USER=postgres
DB_HOST=localhost
DB_NAME=blog_db
DB_PASSWORD=your_password
DB_PORT=5432
JWT_SECRET=your_super_secret_key
PORT=3000
```

Start the backend server:
```bash
node server.js
```
The server will start on `http://localhost:3000`.

#### 3. Frontend Setup
Navigate to the `frontend` directory and install dependencies:
```bash
cd ../frontend
npm install
```

Start the development server:
```bash
npm run dev
```
The application will be available at `http://localhost:5173`.

---

<br />

<a name="türkçe"></a>
## 🇹🇷 Türkçe

Bu proje, "Buz Mavisi" (Ice Blue) temalı modern bir kullanıcı arayüzüne, güçlü kimlik doğrulama sistemine ve kapsamlı içerik yönetimine sahip full-stack bir blog uygulamasıdır. **PERN yığını** (PostgreSQL, Express, React, Node.js) ile geliştirilmiştir.

### 🚀 Özellikler

#### **Frontend (Kullanıcı Arayüzü)**
- **Buz Mavisi Teması**: Rahatlatıcı mavi tonları ve cam efekti (glassmorphism) kullanan temiz, modern bir estetik.
- **Responsive Tasarım**: Tüm cihazlar (mobil, tablet, masaüstü) için optimize edilmiştir.
- **Kimlik Doğrulama Sayfaları**: Form doğrulama özellikli şık Giriş ve Kayıt sayfaları.
- **İnteraktif Bileşenler**:
    - **Karşılama Sayfası**: Misafir kullanıcılar için etkileyici hero bölümü.
    - **Yazı Akışı (Feed)**: Makaleleri gözden geçirmek için kart tabanlı düzen.
    - **Yazı Detayı**: Gelişmiş tipografi ve cilalanmış yorum bölümü ile odaklı okuma deneyimi.

#### **Backend (API)**
- **Kimlik Doğrulama**: bcrypt ile güvenli şifreleme ve JWT tabanlı oturum yönetimi.
- **CRUD İşlemleri**: Yazılar ve yorumlar için tam Ekleme, Okuma, Güncelleme, Silme işlevselliği.
- **Güvenlik**: Güvenlik başlıkları (Helmet), CORS yapılandırması ve hız sınırlaması (rate limiting).
- **Veritabanı**: PostgreSQL ile ilişkisel veri modellemesi.

### 🛠 Kullanılan Teknolojiler

#### **Frontend**
- **React**: Bileşen tabanlı UI kütüphanesi.
- **Vite**: Yeni nesil frontend derleme aracı.
- **Tailwind CSS**: Hızlı stil geliştirme için CSS framework'ü.
- **Axios**: API istekleri için HTTP istemcisi.
- **React Router**: Yönlendirme (routing) kütüphanesi.

#### **Backend**
- **Node.js**: JavaScript çalışma zamanı ortamı.
- **Express**: Hızlı, minimalist web framework'ü.
- **PostgreSQL**: Açık kaynaklı nesne-ilişkisel veritabanı sistemi.
- **JWT (JSON Web Token)**: Güvenli veri transferi ve kimlik doğrulama.

### ⚙️ Kurulum ve Ayarlar

#### Gereksinimler
- Node.js (v14+)
- Yerel olarak çalışan PostgreSQL.

#### 1. Veritabanı Kurulumu
`blog_db` adında bir PostgreSQL veritabanı oluşturun (veya `.env` dosyasında güncelleyin).
```sql
CREATE DATABASE blog_db;
```

#### 2. Backend Kurulumu
`backend` klasörüne gidin ve bağımlılıkları yükleyin:
```bash
cd backend
npm install
```

`backend` dizininde aşağıdaki değişkenlerle bir `.env` dosyası oluşturun:
```env
DB_USER=postgres
DB_HOST=localhost
DB_NAME=blog_db
DB_PASSWORD=sifreniz
DB_PORT=5432
JWT_SECRET=gizli_anahtariniz
PORT=3000
```

Backend sunucusunu başlatın:
```bash
node server.js
```
Sunucu `http://localhost:3000` adresinde başlayacaktır.

#### 3. Frontend Kurulumu
`frontend` klasörüne gidin ve bağımlılıkları yükleyin:
```bash
cd ../frontend
npm install
```

Geliştirme sunucusunu başlatın:
```bash
npm run dev
```
Uygulama `http://localhost:5173` adresinde erişilebilir olacaktır.

---

## 📌 Proje Yapısı / Project Structure

```
my-blog/
├── backend/            # Express API
│   ├── controllers/    # İstek işleyicileri / Request handlers
│   ├── middleware/     # Auth, hata yönetimi / Auth, error handling
│   ├── routes/         # API uç noktaları / API endpoints
│   ├── utils/          # Veritabanı bağlantısı / Database connection
│   └── server.js       # Giriş noktası / Entry point
│
├── frontend/           # React Application
│   ├── src/
│   │   ├── components/ # Yeniden kullanılabilir UI bileşenleri / Reusable UI components
│   │   ├── context/    # Auth bağlamı / Auth context
│   │   ├── pages/      # Rota sayfaları / Route pages (Home, Login, PostDetail)
│   │   └── utils/      # API yapılandırması / API configuration
│   └── index.css       # Tailwind direktifleri / Tailwind directives
│
└── README.md           # Proje dokümantasyonu / Project documentation
```

---

## 🛡 Güvenlik / Security
- **Helmet**: Güvenlik başlıkları ekler. / Adds security headers.
- **Rate Limiting**: Brute-force saldırılarına karşı korur. / Protects against brute-force attacks.
- **Giriş Doğrulama**: express-validator ile veri bütünlüğü sağlar. / Ensures data integrity with express-validator.
- **CORS**: Frontend kaynağından gelen isteklere izin verecek şekilde yapılandırılmıştır. / Configured to allow requests from the frontend origin.

---

## 📜 Lisans / License
Bu proje açık kaynaktır ve MIT Lisansı altında sunulmaktadır. / This project is open-source and available under the MIT License.