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
const port = process.env.PORT || 5000;

app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_ORIGIN || "http://localhost:5173", credentials: true }));
app.use(express.json());
app.use(morgan("dev"));

app.get("/api/health", (_req, res) => res.json({ ok: true, service: "finpulse-api" }));
app.use("/api/auth", authRoutes);
app.use("/api/stocks", stockRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/admin", adminRoutes);

async function start() {
  if (process.env.MONGODB_URI) {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB connected");
  }
  app.listen(port, () => console.log(`FinPulse API running on ${port}`));
}

start().catch((error) => {
  console.error(error);
  process.exit(1);
});
