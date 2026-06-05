import { useMemo, useState } from "react";
import { chartPoints } from "../data/stocks.js";

export default function MarketChart({ data = chartPoints, range = "1D" }) {
  const [hoverIndex, setHoverIndex] = useState(null);
  const liveData = useMemo(() => buildLiveCandles(data), [data]);
  const width = 920;
  const height = 320;
  const pad = { top: 26, right: 34, bottom: 32, left: 34 };
  const prices = liveData.flatMap((point) => [point.high, point.low, point.open, point.close, point.price]);
  const min = Math.min(...prices) - 4;
  const max = Math.max(...prices) + 4;
  const plotWidth = width - pad.left - pad.right;
  const plotHeight = height - pad.top - pad.bottom;
  const xStep = plotWidth / Math.max(1, liveData.length - 1);
  const y = (value) => pad.top + ((max - value) / (max - min)) * plotHeight;
  const x = (index) => pad.left + index * xStep;
  const candleWidth = Math.max(4, Math.min(12, xStep * 0.5));
  const latest = liveData[liveData.length - 1];
  const first = liveData[0];
  const hovered = hoverIndex === null ? latest : liveData[hoverIndex];
  const hoveredX = hoverIndex === null ? x(liveData.length - 1) : x(hoverIndex);
  const hoveredY = y(hovered.close);
  const trendUp = latest.close >= first.open;

  const handleMove = (event) => {
    const box = event.currentTarget.getBoundingClientRect();
    const relativeX = ((event.clientX - box.left) / box.width) * width;
    const index = Math.round((relativeX - pad.left) / xStep);
    setHoverIndex(Math.max(0, Math.min(liveData.length - 1, index)));
  };

  return (
    <div
      className="group relative h-80 w-full cursor-crosshair overflow-hidden rounded-[26px] bg-[#040b14] shadow-inner"
      onMouseMove={handleMove}
      onMouseLeave={() => setHoverIndex(null)}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_82%_18%,rgba(14,165,233,.28),transparent_28rem),radial-gradient(circle_at_18%_80%,rgba(20,184,166,.16),transparent_24rem),linear-gradient(100deg,rgba(2,6,23,.98),rgba(8,24,42,.93))]" />

      <div className="absolute left-5 top-4 z-10">
        <p className="text-xs font-black uppercase tracking-wider text-slate-400">{range} live chart</p>
        <p className={`text-2xl font-black ${hovered.close >= hovered.open ? "text-emerald-300" : "text-red-300"}`}>
          ${hovered.close.toFixed(2)}
        </p>
      </div>

      <div className="pointer-events-none absolute right-5 top-4 z-10 grid h-8 w-8 place-items-center rounded-lg border border-white/10 bg-white/5 text-lg font-black text-white opacity-80 transition group-hover:opacity-100">
        ⤢
      </div>

      <svg className="relative z-0 h-full w-full" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" role="img" aria-label={`${range} candlestick trading chart`}>
        <defs>
          <filter id="candleGlow">
            <feGaussianBlur stdDeviation="3.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="futureBlur">
            <feGaussianBlur stdDeviation="4" />
          </filter>
          <linearGradient id="fadeRight" x1="0" x2="1">
            <stop offset="0%" stopColor="rgba(6,17,31,0)" />
            <stop offset="68%" stopColor="rgba(6,17,31,0)" />
            <stop offset="100%" stopColor="rgba(6,17,31,.9)" />
          </linearGradient>
        </defs>

        {[0.2, 0.4, 0.6, 0.8].map((tick) => {
          const yy = pad.top + plotHeight * tick;
          return <line key={tick} x1={pad.left} x2={width - pad.right} y1={yy} y2={yy} stroke="rgba(148,163,184,.12)" strokeDasharray="5 8" />;
        })}
        {[0.18, 0.38, 0.58, 0.78].map((tick) => {
          const xx = pad.left + plotWidth * tick;
          return <line key={tick} x1={xx} x2={xx} y1={pad.top} y2={height - pad.bottom} stroke="rgba(148,163,184,.08)" />;
        })}

        <line x1={pad.left - 60} y1={height * 0.47} x2={width - pad.right} y2={height * 0.35} stroke="rgba(37,99,235,.62)" strokeWidth="2" />
        <line x1={pad.left - 60} y1={height * 0.71} x2={width - pad.right} y2={height * 0.52} stroke="rgba(20,184,166,.42)" strokeWidth="2" />

        {liveData.map((point, index) => {
          const cx = x(index);
          const openY = y(point.open);
          const closeY = y(point.close);
          const highY = y(point.high);
          const lowY = y(point.low);
          const up = point.close >= point.open;
          const color = up ? "#18d5b3" : "#ff4d57";
          const bodyY = Math.min(openY, closeY);
          const bodyHeight = Math.max(5, Math.abs(closeY - openY));
          const isFutureDepth = index > liveData.length * 0.72;
          const isActive = hoverIndex === index;
          return (
            <g
              key={`${point.time}-${index}`}
              filter={isFutureDepth ? "url(#futureBlur)" : isActive || index > liveData.length - 7 ? "url(#candleGlow)" : undefined}
              opacity={isFutureDepth ? 0.46 : 1}
            >
              <line x1={cx} x2={cx} y1={highY} y2={lowY} stroke={color} strokeWidth={isActive ? "3.5" : "2.4"} strokeLinecap="round" opacity="0.95" />
              <rect x={cx - candleWidth / 2} y={bodyY} width={candleWidth} height={bodyHeight} rx="2.5" fill={color} opacity="0.98" />
            </g>
          );
        })}

        <path
          d={liveData.map((point, index) => `${index === 0 ? "M" : "L"} ${x(index)} ${y(point.close)}`).join(" ")}
          fill="none"
          stroke={trendUp ? "rgba(20,184,166,.38)" : "rgba(239,68,68,.38)"}
          strokeWidth="2"
          strokeDasharray="3 6"
        />

        <line x1={hoveredX} x2={hoveredX} y1={pad.top} y2={height - pad.bottom} stroke="rgba(255,255,255,.38)" strokeDasharray="4 7" opacity={hoverIndex === null ? 0 : 1} />
        <line x1={pad.left} x2={width - pad.right} y1={hoveredY} y2={hoveredY} stroke="rgba(255,255,255,.22)" strokeDasharray="4 7" opacity={hoverIndex === null ? 0 : 1} />
        <circle cx={hoveredX} cy={hoveredY} r="5" fill={hovered.close >= hovered.open ? "#18d5b3" : "#ff4d57"} stroke="#ffffff" strokeWidth="2" opacity={hoverIndex === null ? 0 : 1} />

        <rect x="0" y="0" width={width} height={height} fill="url(#fadeRight)" />
      </svg>

      <div
        className={`pointer-events-none absolute z-20 min-w-40 rounded-xl border border-white/15 bg-slate-950/90 px-3 py-2 text-xs font-bold text-white shadow-2xl backdrop-blur transition-opacity ${hoverIndex === null ? "opacity-0" : "opacity-100"}`}
        style={{
          left: `${Math.min(78, Math.max(6, (hoveredX / width) * 100))}%`,
          top: `${Math.min(74, Math.max(18, (hoveredY / height) * 100))}%`
        }}
      >
        <div className="mb-1 flex items-center justify-between gap-4">
          <span className="text-slate-400">{hovered.time}</span>
          <span className={hovered.close >= hovered.open ? "text-emerald-300" : "text-red-300"}>
            {hovered.close >= hovered.open ? "+" : "-"}{Math.abs(hovered.close - hovered.open).toFixed(2)}
          </span>
        </div>
        <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-slate-300">
          <span>Open</span><span className="text-right text-white">${hovered.open.toFixed(2)}</span>
          <span>High</span><span className="text-right text-emerald-300">${hovered.high.toFixed(2)}</span>
          <span>Low</span><span className="text-right text-red-300">${hovered.low.toFixed(2)}</span>
          <span>Close</span><span className="text-right text-white">${hovered.close.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
}

function buildLiveCandles(points) {
  const candles = [];
  points.forEach((point, index) => {
    const next = points[index + 1] || point;
    const segments = index === points.length - 1 ? 2 : 4;
    for (let step = 0; step < segments; step += 1) {
      const progress = step / segments;
      const globalIndex = candles.length;
      const wave = Math.sin(globalIndex * 1.45) * 2.4 + Math.cos(globalIndex * 0.72) * 1.35;
      const shock = globalIndex > 12 && globalIndex < 22 ? -10 + (globalIndex - 12) * 0.6 : 0;
      const recovery = globalIndex >= 22 ? Math.min(12, (globalIndex - 22) * 0.85) : 0;
      const base = point.close + (next.close - point.close) * progress + wave + shock + recovery;
      const previousClose = candles[candles.length - 1]?.close ?? point.open;
      const close = Number(base.toFixed(2));
      const open = Number((previousClose + Math.sin(globalIndex * 0.9) * 1.2).toFixed(2));
      const high = Number((Math.max(open, close) + 1.8 + Math.abs(Math.sin(globalIndex)) * 2.3).toFixed(2));
      const low = Number((Math.min(open, close) - 1.8 - Math.abs(Math.cos(globalIndex * 0.8)) * 2.1).toFixed(2));
      candles.push({
        time: step === 0 ? point.time : `${point.time}.${step}`,
        price: close,
        open,
        high,
        low,
        close,
        volume: point.volume + step * 2
      });
    }
  });
  return candles;
}
