import React from "react";
import { TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { HeaderGroup, flexRender } from "@tanstack/react-table";
import { Stock } from "@/lib/types";

interface StockTableHeaderProps {
  headerGroups: HeaderGroup<Stock>[];
}

export const StockTableHeader: React.FC<StockTableHeaderProps> = ({
  headerGroups,
}) => (
  <TableHeader>
    {headerGroups.map((headerGroup) => (
      <TableRow key={headerGroup.id}>
        {headerGroup.headers.map((header) => (
          <TableHead key={header.id}>
            {header.isPlaceholder
              ? null
              : flexRender(header.column.columnDef.header, header.getContext())}
          </TableHead>
        ))}
      </TableRow>
    ))}
  </TableHeader>
);
