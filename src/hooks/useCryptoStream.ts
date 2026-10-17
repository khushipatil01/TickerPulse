import { useState, useEffect, useRef } from 'react';
import type { TradeTick, AnalyticsResult } from '../types/crypto';
import { db } from '../db/tickerDb';

export function useCryptoStream(symbol: string = 'btcusdt') {
  const [ticks, setTicks] = useState<TradeTick[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsResult>({ vwap: 0, volatility: 0, tradeCount: 0, totalVolume: 0 });
  const [isConnected, setIsConnected] = useState(false);

  const pendingBatchRef = useRef<TradeTick[]>([]);
  const dbQueueRef = useRef<TradeTick[]>([]);
  const workerRef = useRef<Worker | null>(null);

  useEffect(() => {
    workerRef.current = new Worker(
      new URL('../workers/analyticsWorker.ts', import.meta.url),
      { type: 'module' }
    );

    workerRef.current.onmessage = (e: MessageEvent) => {
      if (e.data.type === 'ANALYTICS_UPDATED') {
        setAnalytics(e.data.analytics);
      }
    };

    const ws = new WebSocket(`wss://stream.binance.com:9443/ws/${symbol.toLowerCase()}@trade`);
    
    ws.onopen = () => setIsConnected(true);
    ws.onclose = () => setIsConnected(false);

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      const tick: TradeTick = {
        id: data.t,
        symbol: data.s,
        price: parseFloat(data.p),
        quantity: parseFloat(data.q),
        timestamp: data.T,
        isBuyerMaker: data.m, 
      };

      pendingBatchRef.current.push(tick);
      dbQueueRef.current.push(tick);
    };

    let rafId: number;
    const updateLoop = () => {
      if (pendingBatchRef.current.length > 0) {
        const delta = [...pendingBatchRef.current];
        pendingBatchRef.current = [];

        workerRef.current?.postMessage({ type: 'ADD_TICKS', ticks: delta });

        setTicks((prev) => [...prev, ...delta].slice(-1000));
      }
      rafId = requestAnimationFrame(updateLoop);
    };
    rafId = requestAnimationFrame(updateLoop);

    const dbInterval = setInterval(() => {
      if (dbQueueRef.current.length > 0) {
        const toFlush = [...dbQueueRef.current];
        dbQueueRef.current = [];
        db.trades.bulkPut(toFlush).catch(console.error);
      }
    }, 2000);

    return () => {
      ws.close();
      cancelAnimationFrame(rafId);
      clearInterval(dbInterval);
      workerRef.current?.terminate();
    };
  }, [symbol]);

  return { ticks, analytics, isConnected };
}