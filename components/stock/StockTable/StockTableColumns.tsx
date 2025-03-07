import { ColumnDef, Column } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import { Stock } from "@/lib/types";
import { TradingActions } from "./Actions/TradingActions";
import { StockActions } from "./Actions/StockActions";

export const createSortHeader = (title: string) => {
  const SortHeader = ({ column }: { column: Column<Stock> }) => (
    <Button
      variant="ghost"
      onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      className="p-0 font-semibold"
    >
      {title}
      <ArrowUpDown className="ml-2 h-4 w-4" />
    </Button>
  );
  // Set the display name explicitly
  SortHeader.displayName = `SortHeader(${title})`;

  return SortHeader;
};

export const getStockColumns = (
  showActions: boolean,
  showTrading: boolean,
  onEdit?: (stock: Stock) => void,
  onDelete?: (stockId: string) => void,
): ColumnDef<Stock>[] => {
  const columns: ColumnDef<Stock>[] = [
    {
      accessorKey: "symbol",
      header: createSortHeader("Symbol"),
      cell: ({ row }) => (
        <div className="font-medium">{row.original.symbol}</div>
      ),
    },
    {
      accessorKey: "name",
      header: createSortHeader("Name"),
    },
    {
      accessorKey: "currentPrice",
      header: createSortHeader("Price"),
      cell: ({ row }) => {
        const price = parseFloat(row.getValue("currentPrice"));
        return new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(price);
      },
    },
    {
      accessorKey: "sector",
      header: createSortHeader("Sector"),
    },
    {
      accessorKey: "volume",
      header: createSortHeader("Volume"),
      cell: ({ row }) => row.original.volume?.toLocaleString() || "N/A",
    },
    {
      accessorKey: "marketCap",
      header: createSortHeader("Market Cap"),
      cell: ({ row }) => {
        const marketCap = row.original.marketCap;
        if (!marketCap) return "N/A";
        return `$${(marketCap / 1000000000).toFixed(2)}B`;
      },
    },
  ];

  // Add trading column if showTrading is true
  if (showTrading) {
    columns.push({
      id: "trading",
      header: () => <div className="text-center font-semibold">Actions</div>,
      cell: ({ row }) => (
        <TradingActions stock={row.original} />
      ),
    });
  }

  // Add actions column if showActions is true
  if (showActions) {
    columns.push({
      id: "actions",
      header: () => <div className="text-center font-semibold">Actions</div>,
      cell: ({ row }) => (
        <StockActions
          stock={row.original}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ),
    });
  }

  return columns;
};