import mongoose from "mongoose";

const stockSchema = new mongoose.Schema({
  name: { type: String, required: true },
  symbol: { type: String, unique: true, required: true },
  logo: String,
  category: String,
  price: { type: Number, required: true },
  change: { type: Number, default: 0 },
  marketCap: String,
  volume: String,
  open: Number,
  close: Number,
  high: Number,
  low: Number,
  peRatio: Number
}, { timestamps: true });

export default mongoose.model("Stock", stockSchema);
