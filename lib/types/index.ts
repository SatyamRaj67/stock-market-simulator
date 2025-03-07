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

// User role enum
export enum UserRole {
  USER = "USER",
  ADMIN = "ADMIN",
  SUPER_ADMIN = "SUPER_ADMIN",
}

// User interface
export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatarUrl?: string;
  createdAt?: Date;
  updatedAt?: Date;
  balance: number;
  totalProfit: number;
  portfolioValue: number;
  isActive: boolean;
  lastLogin?: Date;

  // References to related entities
  portfolio?: {
    [stockId: string]: {
      quantity: number;
      averageBuyPrice: number;
    };
  };
  watchlist?: Watchlist;
}

// Portfolio interface
export interface Portfolio {
  id: string;
  userId: string;
  positions: Position[];
  createdAt?: Date;
  updatedAt?: Date;
}

// Position interface
export interface Position {
  id: string;
  portfolioId: string;
  stockId: string;
  quantity: number;
  averageBuyPrice: number;
  currentValue: number;
  profitLoss: number;
  stock?: Stock;
}

export interface Transaction {
  id: string;
  userId: string;
  stockId: string;
  type: TransactionType;
  status: TransactionStatus;
  quantity: number;
  price: number;
  totalAmount: number;
  timestamp: Date;
  createdAt: string;
  stock?: Stock;
}

// Transaction types
export enum TransactionType {
  BUY="BUY",
  SELL="SELL",
}

export enum TransactionStatus {
  PENDING,
  COMPLETED,
  FAILED,
}

export interface TransactionsResponse {
  transactions: Transaction[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}