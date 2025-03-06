import { useState } from "react";

export type SortDirection = "asc" | "desc";
export type SortableField = "symbol" | "name" | "price" | "change";

export function useSortable<T>(
  items: T[],
  config: {
    defaultSortField: SortableField;
    defaultDirection?: SortDirection;
    sortFunctions: Record<SortableField, (a: T, b: T) => number>;
  },
) {
  const [sortBy, setSortBy] = useState<SortableField>(config.defaultSortField);
  const [sortDirection, setSortDirection] = useState<SortDirection>(
    config.defaultDirection || "asc",
  );

  const sortedItems = [...items].sort((a, b) => {
    const compareResult = config.sortFunctions[sortBy](a, b);
    return sortDirection === "asc" ? compareResult : -compareResult;
  });

  const handleSort = (field: SortableField) => {
    if (sortBy === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortDirection("asc");
    }
  };

  return {
    sortedItems,
    sortBy,
    sortDirection,
    handleSort,
  };
}
