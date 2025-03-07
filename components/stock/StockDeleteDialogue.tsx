import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";

type User = {
  id: string;
  name: string | null;
  email: string | null;
};

type AffectedUser = {
  user: User;
  count: number;
};

type StockDeleteDialogueProps = {
  isOpen: boolean;
  stockName: string;
  transactionCount: number;
  affectedUsers: AffectedUser[];
  onOpenChange: (open: boolean) => void;
  onForceDelete: () => void;
};

export function StockDeleteDialogue({
  isOpen,
  stockName,
  transactionCount,
  affectedUsers,
  onOpenChange,
  onForceDelete,
}: StockDeleteDialogueProps) {
  const [confirmText, setConfirmText] = useState("");

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-red-600">
            Warning: Data Loss Risk
          </DialogTitle>
          <DialogDescription>
            <span className="font-semibold">{stockName}</span> has{" "}
            {transactionCount} related transactions across{" "}
            {affectedUsers.length} users. Deleting this stock will remove all
            these transactions.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="h-[200px] w-full rounded-md border p-4">
          <h4 className="font-medium mb-2">Affected users:</h4>
          <div className="space-y-3">
            {affectedUsers.map(({ user, count }) => (
              <div key={user.id} className="border-b pb-2">
                <div className="font-medium">{user.name}</div>
                <div className="text-sm text-muted-foreground">
                  {user.email}
                </div>
                <div className="text-sm font-medium">{count} transactions</div>
              </div>
            ))}
          </div>
        </ScrollArea>

        <div className="space-y-2">
          <Label htmlFor="confirm">
            Type <span className="font-bold">DELETE</span> to confirm:
          </Label>
          <Input
            id="confirm"
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            placeholder="Type DELETE"
          />
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={onForceDelete}
            disabled={confirmText !== "DELETE"}
          >
            Force Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
