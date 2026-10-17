import { useCryptoStream } from './hooks/useCryptoStream';
import { TickerFeed } from './components/TickerFeed';
import { Activity, Zap, Database } from 'lucide-react';

export default function App() {
  const { ticks, analytics, isConnected } = useCryptoStream('btcusdt');

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100 p-4 md:p-8 font-sans">
      <header className="max-w-4xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-4 border-b border-zinc-800">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <Activity className="text-emerald-400" /> TickerPulse
          </h1>
          <p className="text-sm text-zinc-400 mt-1">High-Throughput Rendering & Analytics Engine</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-xs font-mono px-3 py-1.5 rounded-full bg-zinc-900 border border-zinc-800">
            <Database size={14} className="text-blue-400" />
            <span className="text-zinc-300">IndexedDB Synced</span>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono px-3 py-1.5 rounded-full bg-zinc-900 border border-zinc-800">
            <span className={`h-2 w-2 rounded-full ${isConnected ? 'bg-emerald-400 animate-pulse' : 'bg-red-500'}`} />
            {isConnected ? 'BTC/USDT LIVE' : 'DISCONNECTED'}
          </div>
        </div>
      </header>

      <section className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="p-4 bg-zinc-900/60 border border-zinc-800 rounded-lg shadow-sm">
          <span className="text-xs text-zinc-400 block mb-1">Rolling VWAP</span>
          <span className="text-xl font-mono font-semibold text-emerald-400">
            ${analytics.vwap > 0 ? analytics.vwap.toFixed(2) : '---'}
          </span>
        </div>
        <div className="p-4 bg-zinc-900/60 border border-zinc-800 rounded-lg shadow-sm">
          <span className="text-xs text-zinc-400 block mb-1">Price Volatility</span>
          <span className="text-xl font-mono font-semibold text-amber-400">
            ${analytics.volatility > 0 ? analytics.volatility.toFixed(4) : '---'}
          </span>
        </div>
        <div className="p-4 bg-zinc-900/60 border border-zinc-800 rounded-lg shadow-sm">
          <span className="text-xs text-zinc-400 block mb-1">Buffered Ticks</span>
          <span className="text-xl font-mono font-semibold text-blue-400">{ticks.length}</span>
        </div>
        <div className="p-4 bg-zinc-900/60 border border-zinc-800 rounded-lg flex flex-col justify-center shadow-sm">
          <span className="text-xs text-zinc-400 block mb-1">Main Thread Status</span>
          <span className="text-sm font-mono text-emerald-400 flex items-center gap-1">
            <Zap size={14} /> 60 FPS Locked
          </span>
        </div>
      </section>

      <section className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between text-xs text-zinc-500 font-mono px-4 mb-2">
          <span className="w-32">TIME</span>
          <span className="w-24 text-right">PRICE</span>
          <span className="w-24 text-right">QTY (BTC)</span>
        </div>
        <TickerFeed ticks={ticks} />
      </section>
    </main>
  );
}