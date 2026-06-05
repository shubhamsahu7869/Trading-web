import { ArrowRight, BadgeCheck, Bolt, Newspaper, ShieldCheck, Sparkles, WalletCards } from "lucide-react";
import { Link } from "react-router-dom";
import MarketChart from "../components/MarketChart.jsx";
import StockCard from "../components/StockCard.jsx";
import { stocks } from "../data/stocks.js";

export default function Home() {
  return (
    <div className="space-y-16">
      <section className="section grid items-center gap-8 py-8 lg:grid-cols-[1fr_480px]">
        <div>
          <p className="mb-4 inline-flex rounded-full bg-blue-50 px-4 py-2 text-sm font-black text-accent">US markets open · S&P +0.72%</p>
          <h1 className="text-5xl font-black leading-tight text-ink md:text-7xl">Premium trading, clear at every tap.</h1>
          <p className="mt-5 max-w-2xl text-lg text-slate-600">Track trending stocks, review your portfolio, and place simulated buy or sell orders from one polished dashboard.</p>
          <Link to="/stocks" className="mt-8 inline-flex items-center gap-2 rounded-2xl bg-accent px-6 py-4 font-black text-white shadow-lg shadow-blue-200">
            Explore Stocks <ArrowRight size={20} />
          </Link>
        </div>
        <div className="glass rounded-[32px] p-5">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-slate-500">Market Overview</p>
              <h2 className="text-2xl font-black">FinPulse Index</h2>
            </div>
            <span className="rounded-full bg-emerald-50 px-3 py-1 text-sm font-black text-gain">+2.18%</span>
          </div>
          <MarketChart />
        </div>
      </section>

      <section className="section">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <p className="font-black text-accent">Trending Stocks</p>
            <h2 className="text-3xl font-black text-ink">Today&apos;s top movers</h2>
          </div>
          <Link to="/stocks" className="hidden font-black text-accent md:block">View all</Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stocks.slice(0, 4).map((stock) => <StockCard key={stock.id} stock={stock} />)}
        </div>
      </section>

      <section className="section grid gap-4 md:grid-cols-4">
        {[
          ["Easy Trading", Bolt],
          ["Secure Transactions", ShieldCheck],
          ["Real-Time Data", Sparkles],
          ["Smart Investing", WalletCards]
        ].map(([label, Icon]) => (
          <div key={label} className="rounded-[28px] bg-white p-6 shadow-sm">
            <Icon className="text-accent" size={28} />
            <h3 className="mt-4 text-lg font-black">{label}</h3>
            <p className="mt-2 text-sm text-slate-500">Fast workflows, clear signals, and controls designed for confident execution.</p>
          </div>
        ))}
      </section>

      <section className="bg-white/70 py-14">
        <div className="section grid gap-8 lg:grid-cols-3">
          <div>
            <p className="font-black text-accent">Why Choose Us</p>
            <h2 className="mt-2 text-4xl font-black">Built for frequent, focused investors.</h2>
          </div>
          {["Fast Execution", "Low Fees", "Secure Platform", "Real-Time Updates", "Referral Rewards", "Smart Alerts"].map((item) => (
            <div key={item} className="flex gap-3 rounded-3xl border border-slate-100 bg-white p-5 shadow-sm">
              <BadgeCheck className="shrink-0 text-gain" />
              <div>
                <h3 className="font-black">{item}</h3>
                <p className="text-sm text-slate-500">Professional-grade trading experience with transparent controls.</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="section grid gap-5 lg:grid-cols-3">
        {["The cleanest mobile trading dashboard I have used.", "Order review is quick and reassuring.", "The portfolio view makes returns obvious."].map((quote, index) => (
          <blockquote key={quote} className="glass rounded-[28px] p-6">
            <p className="text-lg font-bold text-ink">“{quote}”</p>
            <footer className="mt-4 text-sm font-black text-slate-500">Investor {index + 1}</footer>
          </blockquote>
        ))}
      </section>

      <section className="section grid gap-6 lg:grid-cols-2">
        <div className="rounded-[28px] bg-slate-900 p-7 text-white">
          <Newspaper />
          <h2 className="mt-4 text-3xl font-black">Market News Preview</h2>
          <p className="mt-3 text-slate-300">AI chip demand lifts semiconductor names while megacap technology leads the broader market higher.</p>
        </div>
        <div className="rounded-[28px] bg-white p-7 shadow-sm">
          <h2 className="text-3xl font-black">FAQ</h2>
          {["Can I trade as guest?", "Is this secure?", "Can admins manage stocks?"].map((question) => (
            <details key={question} className="mt-4 rounded-2xl bg-slate-50 p-4">
              <summary className="cursor-pointer font-black">{question}</summary>
              <p className="mt-2 text-sm text-slate-500">Yes, the interface supports the requested workflow and the backend includes protected API foundations.</p>
            </details>
          ))}
        </div>
      </section>
    </div>
  );
}
