import { Router } from "express";
import Stock from "../models/Stock.js";
import { requireAuth, requireRole } from "../middleware/auth.js";

const router = Router();

router.get("/", async (req, res) => {
  const { q, category } = req.query;
  const filter = {};
  if (category) filter.category = category;
  if (q) filter.$or = [{ name: new RegExp(q, "i") }, { symbol: new RegExp(q, "i") }];
  res.json(await Stock.find(filter).sort({ change: -1 }));
});

router.get("/:symbol", async (req, res) => {
  const stock = await Stock.findOne({ symbol: req.params.symbol.toUpperCase() });
  if (!stock) return res.status(404).json({ message: "Stock not found" });
  res.json(stock);
});

router.post("/", requireAuth, requireRole("admin"), async (req, res) => {
  res.status(201).json(await Stock.create(req.body));
});

router.patch("/:id", requireAuth, requireRole("admin"), async (req, res) => {
  res.json(await Stock.findByIdAndUpdate(req.params.id, req.body, { new: true }));
});

export default router;
