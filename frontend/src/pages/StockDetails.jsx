import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import CompanyLogo from "../components/CompanyLogo.jsx";
import MarketChart from "../components/MarketChart.jsx";
import StockCard from "../components/StockCard.jsx";
import { getChartPoints, stocks } from "../data/stocks.js";
import { useAuth } from "../context/AuthContext.jsx";

export default function StockDetails() {
  const { id } = useParams();
  const stock = stocks.find((item) => item.id === id) || stocks[0];
  const [qty, setQty] = useState(1);
  const [amount, setAmount] = useState(stock.price);
  const [orderMode, setOrderMode] = useState("quantity");
  const [range, setRange] = useState("1D");
  const [modal, setModal] = useState(null);
  const { showToast } = useAuth();
  const chartData = useMemo(() => getChartPoints(stock.price, range), [range, stock.price]);
  const shares = orderMode === "quantity" ? Math.max(1, qty) : Math.max(0, amount / stock.price);
  const total = useMemo(() => shares * stock.price, [shares, stock.price]);
  const positive = stock.change >= 0;
  const ranges = ["1D", "1W", "1M", "6M", "1Y", "MAX"];

  const confirmOrder = () => {
    showToast(`${modal} order placed for ${shares.toFixed(orderMode === "amount" ? 4 : 0)} ${stock.symbol} shares`);
    setModal(null);
  };

  return (
    <div className="section space-y-8 py-8">
      <div className="glass rounded-[32px] p-6">
        <div className="flex flex-wrap items-center justify-between gap-5">
          <div className="flex items-center gap-4">
            <CompanyLogo stock={stock} className="h-16 w-16 rounded-3xl" textClassName="text-lg" />
            <div>
              <p className="text-sm font-black text-slate-500">{stock.symbol}</p>
              <h1 className="text-4xl font-black">{stock.name}</h1>
            </div>
          </div>
          <div className="text-right">
            <p className="text-4xl font-black">${stock.price.toFixed(2)}</p>
            <p className={`inline-flex items-center gap-1 font-black ${positive ? "text-gain" : "text-loss"}`}>
              {positive ? <ArrowUpRight size={18} /> : <ArrowDownRight size={18} />}
              {Math.abs(stock.change).toFixed(2)}%
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="rounded-[32px] bg-white p-5 shadow-sm">
          <div className="mb-5 flex flex-wrap gap-2">
            {ranges.map((item) => (
              <button
                key={item}
                onClick={() => setRange(item)}
                className={`rounded-full px-4 py-2 text-sm font-black transition ${range === item ? "bg-accent text-white shadow-lg shadow-blue-100" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}
              >
                {item}
              </button>
            ))}
          </div>
          <MarketChart data={chartData} range={range} />
        </div>
        <div className="rounded-[32px] bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-black">Buy / Sell</h2>
          <div className="mt-5 grid grid-cols-2 rounded-2xl bg-slate-100 p-1 text-sm font-black">
            {[
              ["quantity", "By Shares"],
              ["amount", "By Money"]
            ].map(([value, label]) => (
              <button
                key={value}
                onClick={() => setOrderMode(value)}
                className={`rounded-xl py-3 transition ${orderMode === value ? "bg-white text-accent shadow" : "text-slate-500"}`}
              >
                {label}
              </button>
            ))}
          </div>
          {orderMode === "quantity" ? (
            <>
              <label className="mt-5 block text-sm font-black text-slate-500">Quantity</label>
              <input className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-lg font-black outline-none" min="1" type="number" value={qty} onChange={(event) => setQty(Number(event.target.value || 1))} />
            </>
          ) : (
            <>
              <label className="mt-5 block text-sm font-black text-slate-500">Investment Amount</label>
              <div className="mt-2 flex items-center rounded-2xl border border-slate-200 px-4 py-3">
                <span className="text-lg font-black text-slate-400">$</span>
                <input className="w-full bg-transparent px-2 text-lg font-black outline-none" min={stock.price} type="number" value={amount} onChange={(event) => setAmount(Number(event.target.value || 0))} />
              </div>
            </>
          )}
          <div className="mt-5 rounded-2xl bg-slate-50 p-4">
            <p className="text-sm font-bold text-slate-500">Estimated Cost</p>
            <p className="text-3xl font-black">${total.toFixed(2)}</p>
            <p className="mt-1 text-sm font-bold text-slate-500">Estimated Shares: {shares.toFixed(orderMode === "amount" ? 4 : 0)}</p>
          </div>
          <div className="mt-5 grid grid-cols-2 gap-3">
            <button onClick={() => setModal("Buy")} className="rounded-2xl bg-gain py-4 font-black text-white">Buy Stock</button>
            <button onClick={() => setModal("Sell")} className="rounded-2xl bg-loss py-4 font-black text-white">Sell Stock</button>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-6">
        {[
          ["Open", stock.open],
          ["Close", stock.close],
          ["Day High", stock.high],
          ["Day Low", stock.low],
          ["Market Cap", stock.marketCap],
          ["P/E Ratio", stock.peRatio]
        ].map(([label, value]) => (
          <div key={label} className="rounded-3xl bg-white p-5 shadow-sm">
            <p className="text-sm font-black text-slate-500">{label}</p>
            <p className="mt-2 text-xl font-black">{typeof value === "number" ? value.toFixed(2) : value}</p>
          </div>
        ))}
      </div>

      <section>
        <h2 className="mb-4 text-3xl font-black">People Also Invest In</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stocks.filter((item) => item.id !== stock.id).slice(0, 4).map((item) => <StockCard key={item.id} stock={item} />)}
        </div>
      </section>

      <section className="rounded-[32px] bg-white p-6 shadow-sm">
        <h2 className="text-3xl font-black">Latest News</h2>
        {["Analysts raise price targets after enterprise demand beats expectations.", "Trading volume climbs as investors rotate into quality growth.", "Management highlights margin expansion during investor day."].map((item) => (
          <Link key={item} to="/stocks" className="mt-4 block rounded-2xl bg-slate-50 p-4 font-bold text-slate-700">{item}</Link>
        ))}
      </section>

      {modal && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-slate-900/40 p-4">
          <div className="w-full max-w-md rounded-[32px] bg-white p-7 shadow-glass">
            <h2 className="text-3xl font-black">Confirm {modal}</h2>
            <p className="mt-3 text-slate-500">{modal} {shares.toFixed(orderMode === "amount" ? 4 : 0)} share(s) of {stock.symbol} for ${total.toFixed(2)}.</p>
            <div className="mt-6 grid grid-cols-2 gap-3">
              <button onClick={() => setModal(null)} className="rounded-2xl bg-slate-100 py-3 font-black">Cancel</button>
              <button onClick={confirmOrder} className="rounded-2xl bg-accent py-3 font-black text-white">Confirm</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
