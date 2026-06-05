import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import helmet from "helmet";
import mongoose from "mongoose";
import morgan from "morgan";
import adminRoutes from "./routes/admin.js";
import authRoutes from "./routes/auth.js";
import stockRoutes from "./routes/stocks.js";
import transactionRoutes from "./routes/transactions.js";

dotenv.config();

const app = express();
let mongoPromise;

export async function connectMongo() {
  if (!process.env.MONGODB_URI) return;
  if (mongoose.connection.readyState === 1) return;
  if (!mongoPromise) {
    mongoPromise = mongoose.connect(process.env.MONGODB_URI);
  }
  await mongoPromise;
}

app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_ORIGIN?.split(",").map((origin) => origin.trim()) || true,
  credentials: true
}));
app.use(express.json());
app.use(morgan("dev"));

app.get("/api/health", (_req, res) => res.json({ ok: true, service: "finpulse-api" }));

app.use(async (req, res, next) => {
  try {
    await connectMongo();
    next();
  } catch (error) {
    res.status(503).json({ message: "Database connection failed", detail: error.message });
  }
});

app.use("/api/auth", authRoutes);
app.use("/api/stocks", stockRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/admin", adminRoutes);

export default app;
