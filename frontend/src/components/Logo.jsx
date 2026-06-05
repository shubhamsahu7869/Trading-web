import { TrendingUp } from "lucide-react";

export default function Logo() {
  return (
    <div className="flex items-center gap-2">
      <div className="grid h-10 w-10 place-items-center rounded-2xl bg-accent text-white shadow-lg shadow-blue-200">
        <TrendingUp size={22} />
      </div>
      <span className="text-xl font-black tracking-tight text-ink">FinPulse</span>
    </div>
  );
}
