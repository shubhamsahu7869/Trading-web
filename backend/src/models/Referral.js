import mongoose from "mongoose";

const referralSchema = new mongoose.Schema({
  referrer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  referredEmail: { type: String, required: true },
  rewardAmount: { type: Number, default: 0 },
  status: { type: String, default: "Pending" }
}, { timestamps: true });

export default mongoose.model("Referral", referralSchema);
