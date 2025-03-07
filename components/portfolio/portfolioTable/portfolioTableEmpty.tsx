import React from "react";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  message?: string;
  actionLabel?: string;
  actionHref?: string;
  onAction?: () => void;
}

export default function PortfolioTableEmpty({
  message = "No transactions found",
  actionLabel = "Go to market",
  actionHref = "/market",
  onAction,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <h3 className="text-lg font-medium">{message}</h3>
      <p className="text-muted-foreground mt-2">
        Start trading to see your transaction history
      </p>
      {onAction ? (
        <Button className="mt-4" onClick={onAction}>
          {actionLabel}
        </Button>
      ) : (
        <Button className="mt-4" asChild>
          <a href={actionHref}>{actionLabel}</a>
        </Button>
      )}
    </div>
  );
}
