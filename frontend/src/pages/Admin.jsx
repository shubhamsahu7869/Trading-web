import { Activity, BarChart3, ReceiptText, UsersRound } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";

export default function Admin() {
  const { showToast } = useAuth();
  const cards = [
    ["Users", "18,420", UsersRound],
    ["Transactions", "62,912", ReceiptText],
    ["Revenue", "$842K", BarChart3],
    ["Activity Logs", "9,304", Activity]
  ];
  return (
    <div className="section space-y-8 py-8">
      <div>
        <p className="font-black text-accent">Admin Panel</p>
        <h1 className="text-5xl font-black">Operations dashboard</h1>
      </div>
      <div className="grid gap-4 md:grid-cols-4">
        {cards.map(([label, value, Icon]) => <div key={label} className="glass rounded-[28px] p-6"><Icon className="text-accent" /><p className="mt-4 text-sm font-black text-slate-500">{label}</p><p className="text-3xl font-black">{value}</p></div>)}
      </div>
      <div className="grid gap-5 lg:grid-cols-2">
        {["Manage Users", "Manage Stocks", "Manage Transactions", "Manage Referrals", "Dashboard Analytics", "Revenue Reports", "User Activity Logs"].map((item) => (
          <button key={item} onClick={() => showToast(`${item} opened`)} className="rounded-[28px] bg-white p-6 text-left text-xl font-black shadow-sm transition hover:-translate-y-1">{item}</button>
        ))}
      </div>
    </div>
  );
}
