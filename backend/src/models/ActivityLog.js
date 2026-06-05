import mongoose from "mongoose";

const activityLogSchema = new mongoose.Schema({
  actor: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  action: { type: String, required: true },
  entity: String,
  metadata: Object
}, { timestamps: true });

export default mongoose.model("ActivityLog", activityLogSchema);
