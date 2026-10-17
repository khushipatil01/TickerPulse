import Dexie, { type Table } from 'dexie';
import type { TradeTick } from '../types/crypto';

export class TickerDatabase extends Dexie {
  trades!: Table<TradeTick, number>;

  constructor() {
    super('TickerPulseDB');
    this.version(1).stores({
      trades: 'id, symbol, timestamp, price',
    });
  }
}

export const db = new TickerDatabase();