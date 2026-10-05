const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./swagger/swagger");
dotenv.config();

// Custom DNS Servers (Google DNS & Cloudflare DNS)
if (process.env.NODE_ENV !== "production") {
  const dns = require("node:dns");
  dns.setServers(["8.8.8.8", "1.1.1.1"]);
}

const authRoutes = require("./routes/authRoutes");
const rentalRoutes = require("./routes/rentalRoutes");
const bookingRentalRoutes = require("./routes/bookingRentalRoutes");
const penginapanRoutes = require("./routes/penginapanRoutes");
const bookingPenginapanRoutes = require("./routes/bookingPenginapanRoutes");
const tourGuideRoutes = require("./routes/tourGuideRoutes");
const bookingTourGuideRoutes = require("./routes/bookingTourGuideRoutes");
const bookingPaketRoutes = require("./routes/bookingPaketRoutes");
const paketRoutes = require("./routes/paketRoutes");
const verifikasiSellerRoutes = require("./routes/verifikasiSellerRoutes");
const tokenRoutes = require("./routes/tokenRoutes");
const paymentRoutes = require("./routes/paymentRoutes"); // NEW: Payment routes
const app = express();
app.set("trust proxy", 1);
const passport = require("passport");
require("./config/passport"); 
const utilsRoutes = require('./routes/utilsRoutes');
const adminUserRoutes = require('./routes/adminUserRoutes');


// middleware
// ✅ PERBAIKAN
const helmet = require('helmet');
app.use(helmet());

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || (process.env.NODE_ENV !== 'production')) return callback(null, true);
    const allowedOrigins = process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',').map(o => o.trim()) : ['http://localhost:5173', 'https://sabangkarsa.com'];
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(null, false);
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};
app.use(cors(corsOptions));
const cookieParser = require('cookie-parser');
app.use(cookieParser());
app.use(express.json());
app.use(passport.initialize());

if (process.env.NODE_ENV !== 'production') {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}



const rateLimit = require('express-rate-limit');

// Rate limiter global: 100 request per 15 menit per IP
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 500,
  message: { error: 'Terlalu banyak request, coba lagi nanti' }
});

// Rate limiter khusus auth: 10 percobaan per 15 menit
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { error: 'Terlalu banyak percobaan login, coba lagi dalam 15 menit' }
});

app.use('/api/', globalLimiter);
app.use('/api/auth/login', authLimiter);
app.use('/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);
app.use('/auth/register', authLimiter);

// routes (mendukung dengan & tanpa prefix /api)
app.use("/api/auth", authRoutes);
app.use("/auth", authRoutes);

app.use("/api/rental", rentalRoutes);
app.use("/rental", rentalRoutes);

app.use("/api/booking/rental", bookingRentalRoutes);
app.use("/booking/rental", bookingRentalRoutes);

app.use("/api/penginapan", penginapanRoutes);
app.use("/penginapan", penginapanRoutes);

app.use("/api/tourguides", tourGuideRoutes);
app.use("/tourguides", tourGuideRoutes);

app.use("/api/booking/tour-guide", bookingTourGuideRoutes);
app.use("/booking/tour-guide", bookingTourGuideRoutes);

app.use("/api/booking/penginapan", bookingPenginapanRoutes);
app.use("/booking/penginapan", bookingPenginapanRoutes);

app.use("/api/booking/paket", bookingPaketRoutes);
app.use("/booking/paket", bookingPaketRoutes);

app.use("/api/paket", paketRoutes);
app.use("/paket", paketRoutes);

app.use("/api/verifikasi", verifikasiSellerRoutes); 
app.use("/verifikasi", verifikasiSellerRoutes); 

app.use('/api', utilsRoutes);

app.use("/api/token", tokenRoutes);
app.use("/token", tokenRoutes);

app.use('/api/admin', adminUserRoutes);
app.use('/admin', adminUserRoutes);

app.use("/api/payments", paymentRoutes);
app.use("/payments", paymentRoutes);



// root endpoint
app.get("/", (req, res) => {
  res.send("API is running...");
});


app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    message: "SabangKarsa API is running"
  });
});


// Global error handler
app.use((err, req, res, next) => {
  console.error('❌ Unhandled Error:', err);
  res.status(err.status || 500).json({
    error: process.env.NODE_ENV === 'production'
      ? 'Terjadi kesalahan pada server'
      : err.message
  });
});

const PORT = process.env.PORT || 3001;

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected");

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  });



