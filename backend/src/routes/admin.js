import { Router } from "express";
import ActivityLog from "../models/ActivityLog.js";
import Referral from "../models/Referral.js";
import Stock from "../models/Stock.js";
import Transaction from "../models/Transaction.js";
import User from "../models/User.js";
import { requireAuth, requireRole } from "../middleware/auth.js";

const router = Router();
router.use(requireAuth, requireRole("admin"));

router.get("/dashboard", async (_req, res) => {
  const [users, stocks, transactions, referrals, logs] = await Promise.all([
    User.countDocuments(),
    Stock.countDocuments(),
    Transaction.countDocuments(),
    Referral.countDocuments(),
    ActivityLog.find().sort({ createdAt: -1 }).limit(25)
  ]);
  res.json({ users, stocks, transactions, referrals, logs });
});

router.get("/users", async (_req, res) => res.json(await User.find().select("-passwordHash")));
router.get("/transactions", async (_req, res) => res.json(await Transaction.find().populate("user stock").sort({ createdAt: -1 })));
router.get("/referrals", async (_req, res) => res.json(await Referral.find().populate("referrer").sort({ createdAt: -1 })));

export default router;
