import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Transaction, Stock } from "@prisma/client";
import { formatDistanceToNow } from "date-fns";

type TransactionWithStock = Transaction & { stock: Stock };

interface PortfolioTransactionsProps {
  transactions: TransactionWithStock[];
}

export default function PortfolioTransactions({
  transactions,
}: PortfolioTransactionsProps) {
  if (transactions.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-muted-foreground">No transactions yet</p>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Type</TableHead>
            <TableHead>Stock</TableHead>
            <TableHead className="text-right">Quantity</TableHead>
            <TableHead className="text-right">Price</TableHead>
            <TableHead className="text-right">Total</TableHead>
            <TableHead className="text-right">Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map((transaction) => (
            <TableRow key={transaction.id}>
              <TableCell>
                <span
                  className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                    transaction.type === "BUY"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {transaction.type}
                </span>
              </TableCell>
              <TableCell className="font-medium">
                {transaction.stock.symbol} - {transaction.stock.name}
              </TableCell>
              <TableCell className="text-right">
                {transaction.quantity}
              </TableCell>
              <TableCell className="text-right">
                ${parseFloat(transaction.price.toString()).toFixed(2)}
              </TableCell>
              <TableCell className="text-right">
                ${parseFloat(transaction.totalAmount.toString()).toFixed(2)}
              </TableCell>
              <TableCell className="text-right">
                {formatDistanceToNow(new Date(transaction.timestamp), {
                  addSuffix: true,
                })}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
