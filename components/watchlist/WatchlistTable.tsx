import { Table, TableBody } from "@/components/ui/table";
import { WatchlistTableHeader } from "./WatchlistTableHeader";
import { WatchlistItem } from "./WatchlistItem";
import { SortableField, SortDirection } from "@/lib/hooks/useSortable";

interface WatchlistTableProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  items: any[];
  sortBy: SortableField;
  sortDirection: SortDirection;
  onSort: (field: SortableField) => void;
  onRemoveItem: (id: string) => void;
  isRemoving: boolean;
}

export function WatchlistTable({
  items,
  sortBy,
  sortDirection,
  onSort,
  onRemoveItem,
  isRemoving,
}: WatchlistTableProps) {
  return (
    <Table>
      <WatchlistTableHeader
        sortBy={sortBy}
        sortDirection={sortDirection}
        onSort={onSort}
      />
      <TableBody>
        {items.map((item) => (
          <WatchlistItem
            key={item.id}
            item={item}
            onRemove={onRemoveItem}
            isRemoving={isRemoving}
          />
        ))}
      </TableBody>
    </Table>
  );
}
