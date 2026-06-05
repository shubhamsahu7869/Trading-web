import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  userId: { type: String, unique: true, required: true },
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  mobile: String,
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ["user", "admin"], default: "user" },
  status: { type: String, default: "Verified" },
  walletBalance: { type: Number, default: 0 }
}, { timestamps: true });

export default mongoose.model("User", userSchema);
