import { Loader2 } from "lucide-react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../components/Logo.jsx";

export default function Splash() {
  const navigate = useNavigate();
  useEffect(() => {
    const timer = window.setTimeout(() => navigate("/auth"), 3000);
    return () => window.clearTimeout(timer);
  }, [navigate]);

  return (
    <section className="grid min-h-screen place-items-center px-6">
      <div className="animate-[fadeIn_.8s_ease-out] text-center">
        <div className="mb-5 flex justify-center">
          <Logo />
        </div>
        <h1 className="text-4xl font-black text-ink">Trade with clarity</h1>
        <p className="mt-3 text-slate-500">Live portfolios, smart signals, and secure execution.</p>
        <Loader2 className="mx-auto mt-8 animate-spin text-accent" size={30} />
      </div>
    </section>
  );
}
