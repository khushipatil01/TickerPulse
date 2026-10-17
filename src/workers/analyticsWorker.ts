/// <reference lib="webworker" />

import type { AnalyticsResult, WorkerMessage } from '../types/crypto';

let cumulativePriceVolume = 0;
let totalVolume = 0;
const prices: number[] = [];
const MAX_WINDOW = 2000;

self.onmessage = (e: MessageEvent<WorkerMessage>) => {
  if (e.data.type === 'RESET') {
    cumulativePriceVolume = 0;
    totalVolume = 0;
    prices.length = 0;
    return;
  }

  if (e.data.type === 'ADD_TICKS' && e.data.ticks) {
    const newTicks = e.data.ticks;

    for (let i = 0; i < newTicks.length; i++) {
      const { price, quantity } = newTicks[i];
      cumulativePriceVolume += price * quantity;
      totalVolume += quantity;
      prices.push(price);

      if (prices.length > MAX_WINDOW) {
        prices.shift(); 
      }
    }

    const vwap = totalVolume > 0 ? cumulativePriceVolume / totalVolume : 0;
    
    const meanPrice = prices.reduce((a, b) => a + b, 0) / prices.length;
    const variance = prices.reduce((acc, p) => acc + Math.pow(p - meanPrice, 2), 0) / prices.length;
    const volatility = Math.sqrt(variance);

    const result: AnalyticsResult = {
      vwap,
      volatility,
      tradeCount: prices.length,
      totalVolume,
    };

    self.postMessage({ type: 'ANALYTICS_UPDATED', analytics: result });
  }
};