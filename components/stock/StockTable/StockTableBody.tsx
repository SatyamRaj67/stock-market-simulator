import React from "react";
import { TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Row, flexRender } from "@tanstack/react-table";
import { Stock } from "@/lib/types";

interface StockTableBodyProps {
  rows: Row<Stock>[];
  isLoading: boolean;
  columnsLength: number;
}

export const StockTableBody: React.FC<StockTableBodyProps> = ({
  rows,
  isLoading,
  columnsLength,
}) => {
  if (isLoading) {
    return (
      <TableBody>
        <TableRow>
          <TableCell colSpan={columnsLength} className="h-24 text-center">
            <div className="flex justify-center items-center h-full">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
              <span className="ml-2">Loading...</span>
            </div>
          </TableCell>
        </TableRow>
      </TableBody>
    );
  }

  if (rows.length === 0) {
    return (
      <TableBody>
        <TableRow>
          <TableCell colSpan={columnsLength} className="h-24 text-center">
            No stocks found
          </TableCell>
        </TableRow>
      </TableBody>
    );
  }

  return (
    <TableBody>
      {rows.map((row) => (
        <TableRow key={row.id}>
          {row.getVisibleCells().map((cell) => (
            <TableCell key={cell.id}>
              {flexRender(cell.column.columnDef.cell, cell.getContext())}
            </TableCell>
          ))}
        </TableRow>
      ))}
    </TableBody>
  );
};
