import express from "express";
import dotenv from "dotenv";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import rateLimit from "express-rate-limit";

import auth_router from "./routes/auth.js";
import room_router from "./routes/room.js";
import chats_router from "./routes/chats.js";
import generate_router from "./routes/generate.js";
import { authMiddleware } from "./middleware/auth.js";

dotenv.config();

const app = express();

// Basic hardening
app.use(helmet());
app.use(express.json());

// Logging
app.use(morgan("common"));

// CORS: restrict in production via env ALLOWED_ORIGINS (comma separated)
const allowedOrigins = (process.env.ALLOWED_ORIGINS || "http://localhost:3000")
  .split(",")
  .map(s => s.trim());
app.use(cors({
  origin: (origin, cb) => {
    // allow no-origin (curl / server-to-server)
    if (!origin) return cb(null, true);
    if (allowedOrigins.includes(origin)) return cb(null, true);
    return cb(new Error("CORS policy: origin not allowed"));
  }
}));

// global rate limiter
const globalLimiter = rateLimit({
  windowMs: 60 * 1000, 
  max: 300, 
  standardHeaders: true,
  legacyHeaders: false
});
app.use(globalLimiter);

// Routes
app.use("/api/auth", auth_router); // signup, signin

app.use("/api/room", authMiddleware,room_router);
app.use("/api/chats", authMiddleware, chats_router);
app.use("/api/generate", authMiddleware,generate_router);

// Health
app.get("/health", (req, res) => res.json({ ok: true }));

// Error handler
//@ts-ignore
app.use((err, req, res, next) => {
  console.error(err);
  if (err.name === "UnauthorizedError") {
    return res.status(401).json({ message: "Invalid token" });
  }
  res.status(err.status || 500).json({ message: err.message || "Server error" });
});

const HOST = process.env.BIND_ADDRESS || "127.0.0.1";
const PORT = Number(process.env.PORT || 3001);
app.listen(PORT, HOST, () => console.log(`Server listening on ${HOST}:${PORT}`));
