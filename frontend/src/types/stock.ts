export enum TimeframeEnum {
  '1Min' = '1Min',
  '5Min' = '5Min',
  '15Min' = '15Min',
  '1Hour' = '1Hour',
  '1Day' = '1Day',
}

export interface StockBar {
  id: number;
  symbol: string;
  timeframe: TimeframeEnum;
  timestamp: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  vwap: number;
  trade_count: number;
}

export interface OptionData {
  id: number;
  symbol: string;
  expiration_date: string;
  strike_price: number;
  option_type: 'call' | 'put';
  open_interest: number;
  volume: number;
}

export interface SyncStatus {
  lastSync: string | null;
  status: 'idle' | 'syncing' | 'completed' | 'failed';
  message: string;
  details?: Record<string, unknown>;
}
