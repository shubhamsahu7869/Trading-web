import { Download } from "lucide-react";
import { useMemo, useState } from "react";
import { stocks, transactions } from "../data/stocks.js";
import { useAuth } from "../context/AuthContext.jsx";

export default function History() {
  const [filter, setFilter] = useState("Week");
  const { showToast } = useAuth();
  const owned = stocks.slice(0, 4).map((stock, index) => ({
    ...stock,
    qty: [8, 14, 3, 5][index],
    buy: [204.12, 121.4, 189.6, 418.82][index]
  }));
  const investment = owned.reduce((sum, item) => sum + item.buy * item.qty, 0);
  const current = owned.reduce((sum, item) => sum + item.price * item.qty, 0);
  const filteredTransactions = useMemo(() => filterTransactions(transactions, filter), [filter]);

  const downloadCsv = () => {
    const headers = ["Type", "Stock", "Date", "Quantity", "Price", "Status"];
    const rows = filteredTransactions.map((item) => [item.type, item.stock, item.date, item.qty, item.price, item.status]);
    const csv = [headers, ...rows].map((row) => row.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(",")).join("\n");
    downloadFile(`finpulse-transactions-${filter.toLowerCase()}.csv`, csv, "text/csv");
    showToast("CSV export downloaded");
  };

  const exportPdf = () => {
    const rows = filteredTransactions.map((item) => `
      <tr><td>${item.type}</td><td>${item.stock}</td><td>${item.date}</td><td>${item.qty}</td><td>$${item.price.toFixed(2)}</td><td>${item.status}</td></tr>
    `).join("");
    const report = `
      <html><head><title>FinPulse Transaction Report</title>
      <style>body{font-family:Arial,sans-serif;padding:32px;color:#102033}h1{margin:0 0 8px}table{border-collapse:collapse;width:100%;margin-top:24px}th,td{border-bottom:1px solid #e5e7eb;padding:12px;text-align:left}th{color:#64748b}</style>
      </head><body><h1>FinPulse Transaction Report</h1><p>${filter} transactions</p><table><thead><tr><th>Type</th><th>Stock</th><th>Date</th><th>Qty</th><th>Price</th><th>Status</th></tr></thead><tbody>${rows}</tbody></table><script>window.onload=()=>window.print()</script></body></html>
    `;
    const url = URL.createObjectURL(new Blob([report], { type: "text/html" }));
    window.open(url, "_blank", "noopener,noreferrer");
    showToast("PDF report opened");
  };

  return (
    <div className="section space-y-8 py-8">
      <div>
        <p className="font-black text-accent">History</p>
        <h1 className="text-5xl font-black">Portfolio activity</h1>
      </div>
      <div className="grid gap-4 md:grid-cols-4">
        {[
          ["Total Investment", investment],
          ["Current Value", current],
          ["Profit/Loss", current - investment],
          ["ROI %", ((current - investment) / investment) * 100]
        ].map(([label, value]) => (
          <div key={label} className="glass rounded-[28px] p-5">
            <p className="text-sm font-black text-slate-500">{label}</p>
            <p className={`mt-2 text-2xl font-black ${label.includes("Profit") && value < 0 ? "text-loss" : ""}`}>{label.includes("%") ? `${value.toFixed(2)}%` : `$${value.toFixed(2)}`}</p>
          </div>
        ))}
      </div>
      <Table title="Owned Stocks" rows={owned.map((item) => [item.name, item.qty, `$${item.buy.toFixed(2)}`, `$${item.price.toFixed(2)}`, `$${((item.price - item.buy) * item.qty).toFixed(2)}`])} headers={["Stock", "Qty", "Buy Price", "Current", "P/L"]} />
      <div className="rounded-[32px] bg-white p-6 shadow-sm">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-3xl font-black">Transaction History</h2>
          <div className="flex flex-wrap gap-2">
            {["Today", "Week", "Month", "Year"].map((item) => (
              <button
                key={item}
                onClick={() => setFilter(item)}
                className={`rounded-full px-4 py-2 text-sm font-black transition ${filter === item ? "bg-slate-900 text-white" : "bg-slate-100 text-ink hover:bg-slate-200"}`}
              >
                {item}
              </button>
            ))}
            <button onClick={exportPdf} className="inline-flex items-center gap-2 rounded-full bg-accent px-4 py-2 text-sm font-black text-white"><Download size={16} /> PDF</button>
            <button onClick={downloadCsv} className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-sm font-black text-white"><Download size={16} /> CSV</button>
          </div>
        </div>
        <Table rows={filteredTransactions.map((item) => [item.type, item.stock, item.date, item.qty, `$${item.price.toFixed(2)}`, item.status])} headers={["Type", "Stock", "Date", "Qty", "Price", "Status"]} empty="No transactions for this period." />
      </div>
    </div>
  );
}

function filterTransactions(items, filter) {
  const now = new Date("2026-06-05T12:00:00");
  const days = { Today: 1, Week: 7, Month: 31, Year: 365 }[filter] || 7;
  const start = new Date(now);
  start.setDate(now.getDate() - days + 1);
  return items.filter((item) => {
    const date = new Date(`${item.date}T12:00:00`);
    return date >= start && date <= now;
  });
}

function downloadFile(filename, content, type) {
  const url = URL.createObjectURL(new Blob([content], { type }));
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

function Table({ title, headers, rows, empty }) {
  return (
    <div className="overflow-hidden rounded-[32px] bg-white shadow-sm">
      {title && <h2 className="p-6 pb-2 text-3xl font-black">{title}</h2>}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] text-left">
          <thead><tr>{headers.map((item) => <th key={item} className="border-b border-slate-100 px-6 py-4 text-sm text-slate-500">{item}</th>)}</tr></thead>
          <tbody>
            {rows.length ? rows.map((row, index) => <tr key={index}>{row.map((cell, cellIndex) => <td key={cellIndex} className="border-b border-slate-100 px-6 py-4 font-bold">{cell}</td>)}</tr>) : (
              <tr><td className="px-6 py-8 text-center font-bold text-slate-500" colSpan={headers.length}>{empty}</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
