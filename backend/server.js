const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const createAdmin = require("./utils/createAdmin");
const seedServices = require("./utils/seedServices");

const projectRoutes = require("./routes/projectRoutes");
const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const homepageRoutes = require("./routes/homepageRoutes");
const quoteRoutes = require("./routes/quoteRoutes");
const serviceRoutes = require("./routes/serviceRoutes");

dotenv.config();

const app = express();

const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'https://aluminiumshopgrk.vercel.app',
  'https://www.aluminiumshopgrk.vercel.app',
  'https://grkaluminium.in',
  'https://www.grkaluminium.in',
];

const extraAllowedOrigins = String(process.env.FRONTEND_URLS || '')
  .split(',')
  .map((value) => value.trim())
  .filter(Boolean);

const isAllowedOrigin = (origin) => {
  if (!origin) {
    return true;
  }

  if (allowedOrigins.includes(origin) || extraAllowedOrigins.includes(origin)) {
    return true;
  }

  try {
    const parsed = new URL(origin);
    return parsed.hostname.endsWith('.vercel.app');
  } catch (_error) {
    return false;
  }
};

app.use(
  cors({
    origin: (origin, callback) => {
      if (isAllowedOrigin(origin)) {
        callback(null, true);
      } else {
        callback(new Error('CORS not allowed'));
      }
    },
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.get("/", (req, res) => {
  res.status(200).json({ message: "Aluminium Shop API is running" });
});

app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/products", productRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/homepage", homepageRoutes);
app.use("/api/quotes", quoteRoutes);

app.use((err, req, res, next) => {
  if (err && err.message === 'CORS not allowed') {
    return res.status(403).json({ message: 'CORS blocked for this origin' });
  }

  if (err && err.message === "Only image files are allowed") {
    return res.status(400).json({ message: err.message });
  }

  if (err && err.name === "MulterError") {
    return res.status(400).json({ message: err.message });
  }

  return res.status(500).json({ message: err.message || "Internal server error" });
});

const PORT = process.env.PORT;

const startServer = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is not set in environment variables");
    }

    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is not set in environment variables");
    }

    if (!PORT) {
      throw new Error("PORT is not set in environment variables");
    }

    await mongoose.connect(process.env.MONGO_URI);
    // eslint-disable-next-line no-console
    console.log("MongoDB connected");

    await createAdmin();
    await seedServices();

    app.listen(PORT, () => {
      // eslint-disable-next-line no-console
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Server failed to start:", error.message);
    process.exit(1);
  }
};

startServer();
