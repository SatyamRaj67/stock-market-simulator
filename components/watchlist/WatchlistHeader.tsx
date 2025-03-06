import { RefreshCwIcon } from "lucide-react";
import { CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface WatchlistHeaderProps {
  onRefresh: () => void;
  isLoading: boolean;
}

export function WatchlistHeader({
  onRefresh,
  isLoading,
}: WatchlistHeaderProps) {
  return (
    <CardHeader className="pb-3">
      <div className="flex justify-between items-center">
        <CardTitle>Watched Stocks</CardTitle>
        <Button
          variant="ghost"
          size="sm"
          onClick={onRefresh}
          disabled={isLoading}
        >
          <RefreshCwIcon className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>
      <CardDescription>Track prices of your favorite stocks</CardDescription>
    </CardHeader>
  );
}
