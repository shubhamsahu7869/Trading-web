import { CheckCircle2, XCircle } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";

export default function Toast() {
  const { toast } = useAuth();
  if (!toast) return null;
  const Icon = toast.type === "error" ? XCircle : CheckCircle2;
  return (
    <div className="fixed right-5 top-5 z-50 flex items-center gap-3 rounded-2xl bg-white px-4 py-3 text-sm font-bold text-ink shadow-glass">
      <Icon className={toast.type === "error" ? "text-loss" : "text-gain"} size={20} />
      {toast.message}
    </div>
  );
}
