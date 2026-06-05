import { BarChart3, Clock3, Home, UserRound } from "lucide-react";
import { NavLink } from "react-router-dom";

const items = [
  ["Home", "/home", Home],
  ["Stocks", "/stocks", BarChart3],
  ["History", "/history", Clock3],
  ["Profile", "/profile", UserRound]
];

export default function BottomNav() {
  return (
    <nav className="fixed inset-x-4 bottom-4 z-40 rounded-[28px] border border-white/80 bg-white/85 px-3 py-2 shadow-glass backdrop-blur-xl md:hidden">
      <div className="grid grid-cols-4">
        {items.map(([label, to, Icon]) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 rounded-2xl py-2 text-xs font-bold transition ${isActive ? "bg-blue-50 text-accent" : "text-slate-500"}`
            }
          >
            <Icon size={20} />
            {label}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
