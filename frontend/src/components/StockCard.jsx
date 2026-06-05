import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import CompanyLogo from "./CompanyLogo.jsx";

export default function StockCard({ stock }) {
  const positive = stock.change >= 0;
  return (
    <Link to={`/stocks/${stock.id}`} className="glass block rounded-[28px] p-5 transition hover:-translate-y-1 hover:shadow-xl">
      <div className="flex items-center justify-between gap-4">
        <CompanyLogo stock={stock} />
        <span className={`flex items-center gap-1 rounded-full px-3 py-1 text-sm font-black ${positive ? "bg-emerald-50 text-gain" : "bg-red-50 text-loss"}`}>
          {positive ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
          {Math.abs(stock.change).toFixed(2)}%
        </span>
      </div>
      <div className="mt-5">
        <p className="text-sm font-bold text-slate-500">{stock.symbol}</p>
        <h3 className="text-xl font-black text-ink">{stock.name}</h3>
        <p className="mt-3 text-2xl font-black">${stock.price.toFixed(2)}</p>
      </div>
    </Link>
  );
}
