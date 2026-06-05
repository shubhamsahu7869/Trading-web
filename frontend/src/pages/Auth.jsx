import { Eye, LockKeyhole, Mail, Phone, UserRound } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../components/Logo.jsx";
import { useAuth } from "../context/AuthContext.jsx";

export default function Auth() {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ name: "", email: "", mobile: "", password: "", confirm: "", remember: true });
  const { login, showToast } = useAuth();
  const navigate = useNavigate();

  const submit = (event) => {
    event.preventDefault();
    if (!form.email.includes("@") || form.password.length < 6) {
      showToast("Enter a valid email and 6+ character password", "error");
      return;
    }
    if (mode === "register" && form.password !== form.confirm) {
      showToast("Passwords do not match", "error");
      return;
    }
    login({ email: form.email, name: form.name });
    navigate("/home");
  };

  const guest = () => {
    showToast("Continuing as guest");
    navigate("/home");
  };

  const field = (key, label, Icon, type = "text") => (
    <label className="block">
      <span className="mb-2 block text-sm font-bold text-slate-600">{label}</span>
      <span className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3">
        <Icon className="text-slate-400" size={19} />
        <input
          className="w-full bg-transparent outline-none"
          type={type}
          value={form[key]}
          onChange={(event) => setForm({ ...form, [key]: event.target.value })}
          required
        />
      </span>
    </label>
  );

  return (
    <section className="section grid min-h-screen items-center gap-10 py-10 lg:grid-cols-[1fr_460px]">
      <div>
        <Logo />
        <h1 className="mt-8 max-w-2xl text-5xl font-black leading-tight text-ink md:text-7xl">Investing tools built for calm decisions.</h1>
        <p className="mt-5 max-w-xl text-lg text-slate-600">A bright, secure trading workspace with fast market discovery, portfolio history, and clean execution flows.</p>
        <div className="mt-8 grid max-w-xl grid-cols-3 gap-3">
          {["JWT Security", "Real-Time UI", "Role Access"].map((item) => (
            <div key={item} className="rounded-2xl bg-white/80 p-4 text-sm font-black text-slate-700 shadow-sm">{item}</div>
          ))}
        </div>
      </div>
      <form onSubmit={submit} className="glass rounded-[32px] p-6 md:p-8">
        <div className="grid grid-cols-2 rounded-2xl bg-slate-100 p-1 text-sm font-black">
          {["login", "register"].map((item) => (
            <button key={item} type="button" onClick={() => setMode(item)} className={`rounded-xl py-3 capitalize ${mode === item ? "bg-white text-accent shadow" : "text-slate-500"}`}>
              {item}
            </button>
          ))}
        </div>
        <div className="mt-6 space-y-4">
          {mode === "register" && field("name", "Full Name", UserRound)}
          {field("email", "Email", Mail, "email")}
          {mode === "register" && field("mobile", "Mobile Number", Phone, "tel")}
          {field("password", "Password", LockKeyhole, "password")}
          {mode === "register" && field("confirm", "Confirm Password", Eye, "password")}
        </div>
        <div className="mt-5 flex items-center justify-between text-sm">
          <label className="flex items-center gap-2 font-semibold text-slate-600">
            <input checked={form.remember} onChange={(e) => setForm({ ...form, remember: e.target.checked })} type="checkbox" />
            Remember me
          </label>
          <button type="button" onClick={() => showToast("Password reset link sent")} className="font-bold text-accent">Forgot password?</button>
        </div>
        <button className="mt-6 w-full rounded-2xl bg-accent py-4 font-black text-white shadow-lg shadow-blue-200">
          {mode === "login" ? "Login" : "Register"}
        </button>
        <button type="button" onClick={guest} className="mt-3 w-full rounded-2xl border border-slate-200 bg-white py-4 font-black text-ink">
          Continue as Guest
        </button>
      </form>
    </section>
  );
}
