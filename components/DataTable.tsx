// DataTable.tsx
"use client";

import React, { forwardRef, useImperativeHandle, useState } from "react";
import {
  useReactTable,
  ColumnDef,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender,
} from "@tanstack/react-table";
import { Checkbox } from "./ui/checkbox";
import { Button } from "@/components/ui/button";
import { addDays, startOfDay, endOfDay, isWithinInterval } from "date-fns";

interface DataTableProps<T> {
  columns: ColumnDef<T>[];
  data: T[];
  searchKey?: string;
  enableRowSelection?: boolean;
  dateField?: keyof T; // New prop to specify which field contains the date
}

export interface DataTableRef<T> {
  getSelectedRowModel: () => { rows: { original: T }[] };
}

// Define a generic function for the DataTable component
function DataTableInner<T>(
  { columns, data, searchKey, enableRowSelection, dateField }: DataTableProps<T>,
  ref: React.Ref<DataTableRef<T>>
) {
  const [globalFilter, setGlobalFilter] = useState("");
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);

  const table = useReactTable({
    data,
    columns,
    state: {
      globalFilter,
    },
    globalFilterFn: (row, columnId, filterValue) => {
      const searchValue = filterValue.toLowerCase();
      const cellValue = String(row.getValue(columnId)).toLowerCase();

      // Check if the row passes the text filter
      const passesTextFilter = cellValue.includes(searchValue);

      // Check if the row passes the date filter
      let passesDateFilter = true;
      if (dateField && startDate && endDate) {
        const rowDateValue = row.original[dateField];
        const rowDate = rowDateValue ? new Date(rowDateValue as any) : null;
        if (rowDate && !isNaN(rowDate.getTime())) { // Ensure valid date
          passesDateFilter = isWithinInterval(rowDate, {
            start: startOfDay(startDate),
            end: endOfDay(endDate),
          });
        }
      }

      return passesTextFilter && passesDateFilter;
    },
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    enableRowSelection: enableRowSelection || false,
  });

  // Expose methods to parent via ref
  useImperativeHandle(ref, () => ({
    getSelectedRowModel: () => table.getSelectedRowModel(),
  }));

  const handleDateRangeChange = (start: Date | undefined, end: Date | undefined) => {
    setStartDate(start);
    setEndDate(end);
    table.setGlobalFilter(globalFilter); // Trigger re-filtering
  };

  const setToday = () => {
    const today = new Date();
    handleDateRangeChange(today, today);
  };

  const setYesterday = () => {
    const yesterday = addDays(new Date(), -1);
    handleDateRangeChange(yesterday, yesterday);
  };

  return (
    <div>
      <div className="mb-4 flex flex-wrap gap-4">
        <input
          type="text"
          placeholder="بحث..."
          value={globalFilter ?? ""}
          onChange={(e) => setGlobalFilter(e.target.value)}
          className="px-4 py-2 border rounded-md flex-grow"
        />
        <div className="flex gap-2">
          {/* Uncomment and adjust the Calendar component if needed */}
          {/* <Calendar
            mode="range"
            selected={{ from: startDate, to: endDate }}
            onSelect={(range) => handleDateRangeChange(range?.from, range?.to)}
            className="rounded-md border"
          /> */}
          {/* <Button onClick={setToday}>اليوم</Button>
          <Button onClick={setYesterday}>أمس</Button> */}
        </div>
      </div>
      <table className="min-w-full border">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id} className="bg-gray-200">
              {headerGroup.headers.map((header) => (
                <th key={header.id} className="px-4 py-2 border">
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id} className="hover:bg-gray-100">
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="px-4 py-2 border">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
          {table.getRowModel().rows.length === 0 && (
            <tr>
              <td colSpan={columns.length} className="text-center py-4">
                لا توجد بيانات
              </td>
            </tr>
          )}
        </tbody>
      </table>
      {/* Pagination */}
      <div className="flex justify-between items-center mt-4">
        <div>
          <button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="px-3 py-1 mr-2 bg-gray-300 rounded disabled:opacity-50"
          >
            السابق
          </button>
          <button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
          >
            التالي
          </button>
        </div>
        <div>
          الصفحة{" "}
          <strong>
            {table.getState().pagination.pageIndex + 1} من{" "}
            {table.getPageCount()}
          </strong>
        </div>
      </div>
    </div>
  );
}

// Define a generic type for the DataTable component
type DataTableComponent = <T>(
  props: DataTableProps<T> & React.RefAttributes<DataTableRef<T>>
) => React.ReactElement;

// Export the DataTable component with proper generic typing
export const DataTable = forwardRef(DataTableInner) as DataTableComponent;
