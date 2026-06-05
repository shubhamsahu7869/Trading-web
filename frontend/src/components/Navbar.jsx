import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import Logo from "./Logo.jsx";

const links = [
  ["Home", "/home"],
  ["Stocks", "/stocks"],
  ["History", "/history"],
  ["Profile", "/profile"],
  ["Admin", "/admin"]
];

export default function Navbar() {
  const { user } = useAuth();
  return (
    <header className="fixed inset-x-0 top-0 z-40 hidden border-b border-slate-200/80 bg-white/75 backdrop-blur-xl md:block">
      <nav className="section flex h-16 items-center justify-between">
        <Link to="/home">
          <Logo />
        </Link>
        <div className="flex items-center gap-2">
          {links.map(([label, to]) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `rounded-full px-4 py-2 text-sm font-semibold transition ${isActive ? "bg-slate-900 text-white" : "text-slate-600 hover:bg-slate-100"}`
              }
            >
              {label}
            </NavLink>
          ))}
        </div>
        {user ? (
          <Link className="rounded-full bg-slate-900 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-slate-200" to="/profile">
            {user.name?.split(" ")[0] || "Profile"}
          </Link>
        ) : (
          <Link className="rounded-full bg-accent px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-blue-200" to="/auth">
            Login / Register
          </Link>
        )}
      </nav>
    </header>
  );
}
