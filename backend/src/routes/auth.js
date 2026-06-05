import bcrypt from "bcryptjs";
import { Router } from "express";
import jwt from "jsonwebtoken";
import { z } from "zod";
import User from "../models/User.js";

const router = Router();
const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  mobile: z.string().min(7).optional(),
  password: z.string().min(6)
});

router.post("/register", async (req, res) => {
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ message: "Invalid registration data" });
  const passwordHash = await bcrypt.hash(parsed.data.password, 12);
  const user = await User.create({
    ...parsed.data,
    userId: String(Math.floor(10000000 + Math.random() * 900000000)),
    passwordHash
  });
  res.status(201).json(createSession(user));
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    return res.status(401).json({ message: "Invalid credentials" });
  }
  res.json(createSession(user));
});

function createSession(user) {
  const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "7d" });
  return {
    token,
    user: {
      id: user.userId,
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
      joinDate: user.createdAt
    }
  };
}

export default router;
