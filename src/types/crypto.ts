export interface TradeTick {
  id: number;
  symbol: string;
  price: number;
  quantity: number;
  timestamp: number;
  isBuyerMaker: boolean;
}

export interface AnalyticsResult {
  vwap: number;
  volatility: number;
  tradeCount: number;
  totalVolume: number;
}

export type WorkerMessage = 
  | { type: 'ADD_TICKS'; ticks: TradeTick[] }
  | { type: 'RESET' };