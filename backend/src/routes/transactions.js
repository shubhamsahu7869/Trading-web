import { Router } from "express";
import Transaction from "../models/Transaction.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.get("/", requireAuth, async (req, res) => {
  res.json(await Transaction.find({ user: req.user.id }).populate("stock").sort({ createdAt: -1 }));
});

router.post("/", requireAuth, async (req, res) => {
  const transaction = await Transaction.create({ ...req.body, user: req.user.id });
  res.status(201).json(transaction);
});

export default router;
