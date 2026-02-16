require("dotenv").config();

const express = require("express");
const app = express();

// Security middleware
const helmet = require("helmet");
const cors = require("cors");
const rateLimit = require("express-rate-limit");

// Routes
const authRoutes = require("./routes/authRoutes");
const postRoutes = require("./routes/postRoutes");
const commentRoutes = require("./routes/commentRoutes");

// Global error handler
const errorHandler = require("./middleware/errorHandler");
const requestLogger = require("./middleware/requestLogger");

// çerezler için
const cookieParser = require("cookie-parser");


app.use((req, res, next) => {
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  next();
});

/* ------------------- SECURITY MIDDLEWARE ------------------- */

// 1. Set secure HTTP headers
app.use(helmet());

app.use(requestLogger);


/*
// 2. Configure CORS (frontend domain whitelist)
app.use(
  cors({
    origin: "http://localhost:5173", //frontend adresi bu olmalı biladerim
    credentials: true
  })
);
*/

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true
  })
);



// 3. Rate limiting (anti brute-force & flood protection)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 dakika
  max: 100, // 15 dakikada maksimum 100 istek
  message: "Çok fazla istek gönderdiniz, lütfen daha sonra tekrar deneyin"
});
app.use(limiter);

// 4. Body parser with size limit (DoS protection)
app.use(express.json({ limit: "10kb" }));

// Cookie parser 
app.use(cookieParser());


/* ------------------- ROUTES ------------------- */

app.get("/", (req, res) => {
  res.send("Backend çalışıyor");
});

app.use("/auth", authRoutes);
app.use("/posts", postRoutes);
app.use("/comments", commentRoutes);

/* ------------------- ERROR HANDLER ------------------- */

app.use(errorHandler);

/* ------------------- SERVER ------------------- */

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
