import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  stock: { type: mongoose.Schema.Types.ObjectId, ref: "Stock", required: true },
  type: { type: String, enum: ["buy", "sell"], required: true },
  quantity: { type: Number, required: true, min: 1 },
  price: { type: Number, required: true },
  status: { type: String, default: "Settled" }
}, { timestamps: true });

export default mongoose.model("Transaction", transactionSchema);
