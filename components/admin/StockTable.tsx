"use client";

import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";

interface Stock {
  id: string;
  symbol: string;
  name: string;
  currentPrice: number;
  sector: string;
  volume: number;
  marketCap?: number;
}

interface StockTableProps {
  stocks: Stock[];
  onEdit: (stock: Stock) => void;
  onDelete: (stockId: string) => void;
}

const StockTable = ({ stocks, onEdit, onDelete }: StockTableProps) => {
  return (
   
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Symbol</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Sector</TableHead>
                <TableHead>Volume</TableHead>
                <TableHead>Market Cap</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {stocks.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center h-24">
                    No stocks found
                  </TableCell>
                </TableRow>
              ) : (
                stocks.map((stock) => (
                  <TableRow key={stock.id}>
                    <TableCell className="font-medium">{stock.symbol}</TableCell>
                    <TableCell>{stock.name}</TableCell>
                    <TableCell>${typeof stock.currentPrice === 'number' ? stock.currentPrice.toFixed(2) : Number(stock.currentPrice).toFixed(2)}</TableCell>
                    <TableCell>{stock.sector}</TableCell>
                    <TableCell>{stock.volume.toLocaleString()}</TableCell>
                    <TableCell>
                      {stock.marketCap
                        ? `$${(stock.marketCap / 1000000000).toFixed(2)}B`
                        : "N/A"}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onEdit(stock)}
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => onDelete(stock.id)}
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Delete
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
  );
};

export default StockTable;