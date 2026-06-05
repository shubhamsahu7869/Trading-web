import { CandlestickSeries, ColorType, createChart, HistogramSeries, LineSeries } from "lightweight-charts";
import { useEffect, useMemo, useRef, useState } from "react";
import { chartPoints } from "../data/stocks.js";

export default function MarketChart({ data = chartPoints, range = "1D" }) {
  const chartRef = useRef(null);
  const candleSeriesRef = useRef(null);
  const volumeSeriesRef = useRef(null);
  const guideSeriesRef = useRef(null);
  const barsRef = useRef([]);
  const [active, setActive] = useState(null);
  const [livePrice, setLivePrice] = useState(data[data.length - 1]?.close || data[data.length - 1]?.price || 0);
  const bars = useMemo(() => buildTradingBars(data, range), [data, range]);
  const latest = bars[bars.length - 1];
  const trendUp = latest.close >= bars[0].open;

  useEffect(() => {
    if (!chartRef.current) return undefined;

    chartRef.current.innerHTML = "";
    barsRef.current = bars;
    setActive(null);
    setLivePrice(latest.close);

    const chart = createChart(chartRef.current, {
      autoSize: true,
      layout: {
        background: { type: ColorType.Solid, color: "#06111f" },
        textColor: "#c4d4ea",
        fontFamily: "Inter, system-ui, sans-serif"
      },
      grid: {
        vertLines: { color: "rgba(148, 163, 184, 0.09)" },
        horzLines: { color: "rgba(148, 163, 184, 0.12)" }
      },
      crosshair: {
        mode: 0,
        vertLine: { color: "rgba(226, 232, 240, .55)", width: 1, style: 3, labelBackgroundColor: "#0f172a" },
        horzLine: { color: "rgba(226, 232, 240, .35)", width: 1, style: 3, labelBackgroundColor: "#0f172a" }
      },
      rightPriceScale: {
        borderColor: "rgba(148, 163, 184, 0.26)",
        scaleMargins: { top: 0.12, bottom: 0.2 }
      },
      timeScale: {
        borderColor: "rgba(148, 163, 184, 0.18)",
        timeVisible: true,
        secondsVisible: false,
        rightOffset: 18,
        barSpacing: 11
      },
      handleScale: true,
      handleScroll: true
    });

    const candleSeries = chart.addSeries(CandlestickSeries, {
      upColor: "#12d6b0",
      downColor: "#ff4d57",
      borderUpColor: "#5ff2d4",
      borderDownColor: "#ff7a82",
      wickUpColor: "#18e0bd",
      wickDownColor: "#ff5864",
      priceLineColor: "#60a5fa",
      priceLineWidth: 2,
      lastValueVisible: true
    });

    const volumeSeries = chart.addSeries(HistogramSeries, {
      priceFormat: { type: "volume" },
      priceScaleId: "",
      color: "rgba(37, 99, 235, .25)"
    });

    const guideSeries = chart.addSeries(LineSeries, {
      color: "rgba(37, 99, 235, .72)",
      lineWidth: 2,
      lineStyle: 0,
      priceLineVisible: false,
      lastValueVisible: false
    });

    candleSeries.priceScale().applyOptions({ scaleMargins: { top: 0.1, bottom: 0.2 } });
    volumeSeries.priceScale().applyOptions({ scaleMargins: { top: 0.78, bottom: 0 } });

    candleSeries.setData(bars);
    volumeSeries.setData(bars.map((bar) => ({
      time: bar.time,
      value: bar.volume,
      color: bar.close >= bar.open ? "rgba(18, 214, 176, .22)" : "rgba(255, 77, 87, .22)"
    })));
    guideSeries.setData([
      { time: bars[0].time, value: bars[0].close * 0.996 },
      { time: latest.time, value: latest.close * 1.01 }
    ]);
    chart.timeScale().fitContent();

    candleSeriesRef.current = candleSeries;
    volumeSeriesRef.current = volumeSeries;
    guideSeriesRef.current = guideSeries;

    chart.subscribeCrosshairMove((param) => {
      if (!param.time || !param.point) {
        setActive(null);
        return;
      }
      const candle = param.seriesData.get(candleSeries);
      if (!candle) return;
      setActive({
        ...candle,
        x: param.point.x,
        y: param.point.y,
        label: formatTimeLabel(param.time, range)
      });
    });

    const interval = window.setInterval(() => {
      const currentBars = barsRef.current;
      const last = currentBars[currentBars.length - 1];
      const tick = Math.sin(Date.now() / 850) * 0.55 + (Math.random() - 0.5) * 0.9;
      const close = Math.max(1, Number((last.close + tick).toFixed(2)));
      const updated = {
        ...last,
        close,
        high: Number(Math.max(last.high, close + Math.random() * 0.8).toFixed(2)),
        low: Number(Math.min(last.low, close - Math.random() * 0.8).toFixed(2)),
        volume: last.volume + Math.round(Math.random() * 18)
      };
      currentBars[currentBars.length - 1] = updated;
      barsRef.current = currentBars;
      candleSeries.update(updated);
      volumeSeries.update({
        time: updated.time,
        value: updated.volume,
        color: updated.close >= updated.open ? "rgba(18, 214, 176, .25)" : "rgba(255, 77, 87, .25)"
      });
      setLivePrice(updated.close);
    }, 1200);

    return () => {
      window.clearInterval(interval);
      chart.remove();
    };
  }, [bars, latest.close, latest.time, range]);

  const display = active || latest;
  const positive = display.close >= display.open;

  return (
    <div className="relative h-[360px] w-full overflow-hidden rounded-[30px] border border-slate-800 bg-[#06111f] shadow-2xl shadow-slate-950/20">
      <div className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(circle_at_76%_18%,rgba(14,165,233,.20),transparent_22rem),linear-gradient(120deg,rgba(2,6,23,.95),rgba(8,31,49,.90))]" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-[1] w-20 bg-gradient-to-l from-[#06111f]/25 to-transparent" />
      <div className="absolute left-5 top-4 z-30">
        <p className="text-xs font-black uppercase tracking-[.18em] text-slate-400">{range} premium live chart</p>
        <div className="mt-1 flex items-end gap-3">
          <p className={`text-3xl font-black ${positive ? "text-emerald-300" : "text-red-300"}`}>${(active ? display.close : livePrice).toFixed(2)}</p>
          <span className={`mb-1 rounded-full px-2 py-1 text-xs font-black ${positive ? "bg-emerald-400/10 text-emerald-300" : "bg-red-400/10 text-red-300"}`}>
            LIVE
          </span>
        </div>
      </div>
      <div className="absolute right-5 top-4 z-30 grid h-9 w-9 place-items-center rounded-xl border border-white/10 bg-white/5 text-lg font-black text-white shadow-lg">
        ↗
      </div>
      <div ref={chartRef} className="relative z-10 h-full w-full pt-12" />
      <div
        className={`pointer-events-none absolute z-40 min-w-44 rounded-2xl border border-white/10 bg-slate-950/95 px-4 py-3 text-xs font-bold text-white shadow-2xl backdrop-blur-md transition-opacity ${active ? "opacity-100" : "opacity-0"}`}
        style={{
          left: active ? `${Math.min(72, Math.max(3, (active.x / Math.max(1, chartRef.current?.clientWidth || 1)) * 100))}%` : "5%",
          top: active ? `${Math.min(68, Math.max(18, (active.y / Math.max(1, chartRef.current?.clientHeight || 1)) * 100))}%` : "20%"
        }}
      >
        <div className="mb-2 flex items-center justify-between gap-4">
          <span className="text-slate-400">{display.label || "Live"}</span>
          <span className={positive ? "text-emerald-300" : "text-red-300"}>{positive ? "+" : "-"}{Math.abs(display.close - display.open).toFixed(2)}</span>
        </div>
        <div className="grid grid-cols-2 gap-x-5 gap-y-1 text-slate-300">
          <span>Open</span><span className="text-right text-white">${display.open.toFixed(2)}</span>
          <span>High</span><span className="text-right text-emerald-300">${display.high.toFixed(2)}</span>
          <span>Low</span><span className="text-right text-red-300">${display.low.toFixed(2)}</span>
          <span>Close</span><span className="text-right text-white">${display.close.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
}

function buildTradingBars(points, range) {
  const now = Math.floor(Date.now() / 1000);
  const stepSeconds = { "1D": 60 * 5, "1W": 60 * 60 * 3, "1M": 60 * 60 * 12, "6M": 60 * 60 * 24 * 3, "1Y": 60 * 60 * 24 * 7, MAX: 60 * 60 * 24 * 21 }[range] || 60 * 5;
  const count = range === "1D" ? 86 : range === "1W" ? 72 : range === "1M" ? 82 : 92;
  const seed = points[0]?.open || points[0]?.price || 200;
  const endTarget = points[points.length - 1]?.close || points[points.length - 1]?.price || seed;
  const bars = [];
  let close = seed;

  for (let index = 0; index < count; index += 1) {
    const progress = index / Math.max(1, count - 1);
    const trend = (endTarget - seed) * progress;
    const selloff = Math.exp(-Math.pow((progress - 0.38) / 0.11, 2)) * -18;
    const breakout = Math.exp(-Math.pow((progress - 0.73) / 0.1, 2)) * 14;
    const wave = Math.sin(index * 0.55) * 3.5 + Math.cos(index * 0.23) * 2.1;
    const target = seed + trend + selloff + breakout + wave;
    const open = close;
    close = Number((target + Math.sin(index * 1.7) * 1.2).toFixed(2));
    const high = Number((Math.max(open, close) + 1.4 + Math.abs(Math.sin(index * 0.9)) * 3.2).toFixed(2));
    const low = Number((Math.min(open, close) - 1.4 - Math.abs(Math.cos(index * 0.7)) * 2.8).toFixed(2));
    bars.push({
      time: now - (count - index) * stepSeconds,
      open: Number(open.toFixed(2)),
      high,
      low,
      close,
      volume: 120 + Math.round(Math.abs(close - open) * 16 + Math.random() * 45)
    });
  }
  return bars;
}

function formatTimeLabel(time, range) {
  const date = new Date(time * 1000);
  if (range === "1D") return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  return date.toLocaleDateString([], { month: "short", day: "numeric" });
}
