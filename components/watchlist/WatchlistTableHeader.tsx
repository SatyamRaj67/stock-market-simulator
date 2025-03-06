import { TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { SortableField, SortDirection } from "@/lib/hooks/useSortable";

interface WatchlistTableHeaderProps {
  sortBy: SortableField;
  sortDirection: SortDirection;
  onSort: (field: SortableField) => void;
}

export function WatchlistTableHeader({
  sortBy,
  sortDirection,
  onSort,
}: WatchlistTableHeaderProps) {
  const getSortIndicator = (field: SortableField) => {
    return sortBy === field ? (sortDirection === "asc" ? "↑" : "↓") : "";
  };

  return (
    <TableHeader>
      <TableRow>
        <TableHead className="cursor-pointer" onClick={() => onSort("symbol")}>
          Symbol {getSortIndicator("symbol")}
        </TableHead>
        <TableHead className="cursor-pointer" onClick={() => onSort("name")}>
          Name {getSortIndicator("name")}
        </TableHead>
        <TableHead
          className="cursor-pointer text-right"
          onClick={() => onSort("price")}
        >
          Price {getSortIndicator("price")}
        </TableHead>
        <TableHead
          className="cursor-pointer text-right"
          onClick={() => onSort("change")}
        >
          Change {getSortIndicator("change")}
        </TableHead>
        <TableHead className="text-right">Added</TableHead>
        <TableHead className="text-right">Actions</TableHead>
      </TableRow>
    </TableHeader>
  );
}
