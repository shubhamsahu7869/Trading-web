import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import CompanyLogo from "../components/CompanyLogo.jsx";
import StockCard from "../components/StockCard.jsx";
import { stocks } from "../data/stocks.js";

export default function Stocks() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("market");
  const [page, setPage] = useState(1);
  const pageSize = 6;
  const categories = ["All", ...new Set(stocks.map((stock) => stock.category))];

  const filtered = useMemo(() => {
    return stocks
      .filter((stock) => category === "All" || stock.category === category)
      .filter((stock) => `${stock.name} ${stock.symbol}`.toLowerCase().includes(query.toLowerCase()))
      .sort((a, b) => (sort === "gain" ? b.change - a.change : b.price - a.price));
  }, [category, query, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const pagedStocks = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const resetPage = (setter) => (value) => {
    setter(value);
    setPage(1);
  };

  return (
    <div className="section space-y-8 py-8">
      <div>
        <p className="font-black text-accent">Stock Marketplace</p>
        <h1 className="text-4xl font-black text-ink md:text-6xl">Find your next position.</h1>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-2">
        {stocks.slice(0, 5).map((stock) => (
          <div key={stock.id} className="min-w-[240px]">
            <StockCard stock={stock} />
          </div>
        ))}
      </div>

      <div className="glass rounded-[28px] p-4">
        <div className="grid gap-3 md:grid-cols-[1fr_180px_180px]">
          <label className="flex items-center gap-3 rounded-2xl bg-white px-4 py-3">
            <Search className="text-slate-400" size={20} />
            <input className="w-full outline-none" placeholder="Search company or symbol" value={query} onChange={(event) => resetPage(setQuery)(event.target.value)} />
          </label>
          <select className="rounded-2xl bg-white px-4 py-3 font-bold outline-none" value={category} onChange={(event) => resetPage(setCategory)(event.target.value)}>
            {categories.map((item) => <option key={item}>{item}</option>)}
          </select>
          <select className="rounded-2xl bg-white px-4 py-3 font-bold outline-none" value={sort} onChange={(event) => resetPage(setSort)(event.target.value)}>
            <option value="market">Sort by Price</option>
            <option value="gain">Sort by Gain</option>
          </select>
        </div>
      </div>

      <div className="overflow-hidden rounded-[28px] bg-white shadow-sm">
        <div className="hidden grid-cols-[2fr_1fr_1fr_1fr_1fr] border-b border-slate-100 px-5 py-4 text-sm font-black text-slate-500 md:grid">
          <span>Company</span><span>Price</span><span>Market Cap</span><span>Volume</span><span>Change</span>
        </div>
        {pagedStocks.map((stock) => (
          <Link key={stock.id} to={`/stocks/${stock.id}`} className="grid gap-3 border-b border-slate-100 px-5 py-4 transition hover:bg-slate-50 md:grid-cols-[2fr_1fr_1fr_1fr_1fr]">
            <span className="flex items-center gap-3 font-black">
              <CompanyLogo stock={stock} className="h-10 w-10 rounded-xl" textClassName="text-xs" />
              {stock.name} <small className="text-slate-400">{stock.symbol}</small>
            </span>
            <span className="font-bold">${stock.price.toFixed(2)}</span>
            <span>{stock.marketCap}</span>
            <span>{stock.volume}</span>
            <span className={stock.change >= 0 ? "font-black text-gain" : "font-black text-loss"}>
              {stock.change >= 0 ? "▲" : "▼"} {Math.abs(stock.change).toFixed(2)}%
            </span>
          </Link>
        ))}
      </div>

      <div className="flex justify-center gap-2">
        {Array.from({ length: totalPages }, (_, index) => index + 1).map((pageNumber) => (
          <button
            key={pageNumber}
            onClick={() => setPage(pageNumber)}
            className={`h-12 w-12 rounded-full font-black transition hover:-translate-y-0.5 ${pageNumber === currentPage ? "bg-accent text-white shadow-lg shadow-blue-200" : "bg-white text-slate-500 hover:bg-slate-100"}`}
            aria-label={`Go to stocks page ${pageNumber}`}
          >
            {pageNumber}
          </button>
        ))}
      </div>
    </div>
  );
}
