export interface Stock {
  id: string;
  symbol: string;
  name: string;
  currentPrice: number;
  previousClose: number;
  openPrice: number;
  highPrice: number;
  lowPrice: number;
  volume: number;
  marketCap?: number;
  description: string;
  sector: string;
  createdAt?: Date;
  updatedAt?: Date;
  createdById?: string;
}

// You can add additional stock-related types
export interface StockFormData {
  symbol: string;
  name: string;
  currentPrice: number;
  previousClose?: number;
  openPrice?: number;
  highPrice?: number;
  lowPrice?: number;
  volume?: number;
  marketCap?: number;
  description?: string;
  sector: string;
}

// API response types
export interface StockResponse {
  success: boolean;
  data?: Stock | Stock[];
  error?: string;
}

export interface WatchlistItem {
  id: string;
  watchlistId: string;
  stockId: string;
  stock: Stock;
  addedAt: string;
}

export interface Watchlist {
  id: string;
  userId: string;
  items: WatchlistItem[];
}
