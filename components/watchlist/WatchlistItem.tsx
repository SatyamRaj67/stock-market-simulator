import { formatDistanceToNow } from "date-fns";
import { ArrowUpIcon, ArrowDownIcon, EyeOffIcon } from "lucide-react";
import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";

interface WatchlistItemProps {
  item: {
    id: string;
    stock: {
      symbol: string;
      name: string;
      currentPrice: string;
      previousClose?: string;
    };
    addedAt: string;
  };
  onRemove: (id: string) => void;
  isRemoving: boolean;
}

export function WatchlistItem({
  item,
  onRemove,
  isRemoving,
}: WatchlistItemProps) {
  const priceChange = item.stock.previousClose
    ? parseFloat(item.stock.currentPrice) - parseFloat(item.stock.previousClose)
    : 0;
  const percentChange = item.stock.previousClose
    ? (priceChange / parseFloat(item.stock.previousClose)) * 100
    : 0;
  const isPositive = priceChange >= 0;

  return (
    <TableRow>
      <TableCell className="font-medium">{item.stock.symbol}</TableCell>
      <TableCell>{item.stock.name}</TableCell>
      <TableCell className="text-right font-mono">
        ${parseFloat(item.stock.currentPrice).toFixed(2)}
      </TableCell>
      <TableCell
        className={`text-right font-mono ${
          isPositive ? "text-green-600" : "text-red-600"
        }`}
      >
        <div className="flex items-center justify-end">
          {isPositive ? (
            <ArrowUpIcon className="h-4 w-4 mr-1" />
          ) : (
            <ArrowDownIcon className="h-4 w-4 mr-1" />
          )}
          {priceChange.toFixed(2)} ({percentChange.toFixed(2)}%)
        </div>
      </TableCell>
      <TableCell className="text-right text-muted-foreground text-sm">
        {formatDistanceToNow(new Date(item.addedAt), {
          addSuffix: true,
        })}
      </TableCell>
      <TableCell className="text-right">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onRemove(item.id)}
          disabled={isRemoving}
        >
          <EyeOffIcon className="h-4 w-4" />
          <span className="sr-only">Remove from watchlist</span>
        </Button>
      </TableCell>
    </TableRow>
  );
}
