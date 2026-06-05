export default function CompanyLogo({ stock, className = "h-12 w-12 rounded-2xl", textClassName = "text-sm" }) {
  return (
    <div
      className={`${className} grid shrink-0 place-items-center bg-white font-black text-white shadow`}
      style={{ background: stock.color || "#2563eb" }}
      title={`${stock.name} logo`}
      aria-label={`${stock.name} logo`}
    >
      <span className={textClassName}>{stock.symbol.slice(0, 2)}</span>
    </div>
  );
}
