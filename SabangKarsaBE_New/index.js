const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./swagger/swagger");
dotenv.config();

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
const passport = require("passport");
require("./config/passport"); 
const utilsRoutes = require('./routes/utilsRoutes');
const adminUserRoutes = require('./routes/adminUserRoutes');


// middleware
// ✅ PERBAIKAN
const helmet = require('helmet');
app.use(helmet());

const corsOptions = {
  origin: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:5173'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};
app.use(cors(corsOptions));
app.use(express.json());

if (process.env.NODE_ENV !== 'production') {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}




const rateLimit = require('express-rate-limit');

// Rate limiter global: 100 request per 15 menit per IP
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
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
app.use('/api/auth/register', authLimiter);



// routes
app.use("/api/auth", authRoutes);
app.use("/api/rental", rentalRoutes);
app.use("/api/booking/rental", bookingRentalRoutes);
app.use("/api/penginapan", penginapanRoutes);
app.use("/api/tourguides", tourGuideRoutes);
app.use("/api/booking/tour-guide", bookingTourGuideRoutes);
app.use("/api/booking/penginapan", bookingPenginapanRoutes);
app.use("/api/booking/paket", bookingPaketRoutes);
app.use("/api/paket", paketRoutes);
app.use("/api/verifikasi", verifikasiSellerRoutes); 
app.use('/api', utilsRoutes);
app.use("/api/token", tokenRoutes);
app.use('/api/admin', adminUserRoutes);
app.use("/api/payments", paymentRoutes); // NEW: Payment routes



app.use(passport.initialize());
// root endpoint
app.get("/", (req, res) => {
  res.send("API is running...");
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

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected");
    app.listen(process.env.PORT, () => {
      console.log(`🚀 Server running at http://localhost:${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
  });



