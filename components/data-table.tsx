"use client";

import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  RowSelectionState,
  FilterFn,
} from "@tanstack/react-table";
import { ChevronDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import jsPDF from "jspdf";
import JsBarcode from "jsbarcode";
import "jspdf-autotable";
import AmiriFont from './Amiri-Regular-normal';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import AmiriBoldFont from "./Amiri-Regular-bold";

// Define your Invoice interface appropriately
interface Invoice {
  invoiceNumber: string;
  date: string; // ISO string or compatible date format
  customerId: { name: string };
  agentId: { name: string };
  items: Array<{
    productId: { barcode: string; name: string };
    quantity: number;
    price: number;
  }>;
  // Add other fields as necessary
}

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  searchKey: string;
  onRowClick?: (row: TData) => void;
}

// Define custom filter functions
const dateRangeFilter: FilterFn<any> = (row, columnId, filterValue) => {
  const invoiceDate = new Date(row.getValue(columnId));

  if (filterValue?.type === 'today') {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset to start of the day
    invoiceDate.setHours(0, 0, 0, 0); // Reset to start of the day
    return invoiceDate.getTime() === today.getTime();
  }

  if (filterValue?.type === 'thisWeek') {
    const now = new Date();
    const firstDayOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
    const lastDayOfWeek = new Date(now.setDate(now.getDate() - now.getDay() + 6));
    firstDayOfWeek.setHours(0, 0, 0, 0);
    lastDayOfWeek.setHours(23, 59, 59, 999);
    return invoiceDate >= firstDayOfWeek && invoiceDate <= lastDayOfWeek;
  }

  if (filterValue?.type === 'custom' && filterValue.start && filterValue.end) {
    const start = new Date(filterValue.start);
    const end = new Date(filterValue.end);
    start.setHours(0, 0, 0, 0);
    end.setHours(23, 59, 59, 999);
    return invoiceDate >= start && invoiceDate <= end;
  }

  return true; // If no filter is applied, include all rows
};

export function DataTable<TData, TValue>({
  columns,
  data,
  searchKey,
  onRowClick,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({});

  // Date Filtering States
  const [dateFilter, setDateFilter] = React.useState<'today' | 'thisWeek' | 'custom' | null>(null);
  const [customDateRange, setCustomDateRange] = React.useState<[Date | null, Date | null]>([null, null]);

  // Memoize columns and data for performance
  const memoizedColumns = React.useMemo(() => columns, [columns]);
  const memoizedData = React.useMemo(() => data, [data]);

  const table = useReactTable({
    data: memoizedData,
    columns: memoizedColumns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
    filterFns: {
      dateRangeFilter, // Register your custom filter function
    },
  });

  // Define the applyDateFilter function
  const applyDateFilter = () => {
    const dateColumn = table.getColumn('date');

    if (!dateColumn) {
      console.warn(`Column 'date' not found.`);
      return;
    }

    if (dateFilter === 'today') {
      dateColumn.setFilterValue({ type: 'today' });
    } else if (dateFilter === 'thisWeek') {
      dateColumn.setFilterValue({ type: 'thisWeek' });
    } else if (dateFilter === 'custom' && customDateRange[0] && customDateRange[1]) {
      dateColumn.setFilterValue({ type: 'custom', start: customDateRange[0], end: customDateRange[1] });
    } else {
      dateColumn.setFilterValue(undefined); // Clear filter
    }
  };

  // Apply date filters when state changes
  React.useEffect(() => {
    applyDateFilter();
  }, [dateFilter, customDateRange]);


// Inside the DataTable component, update the handlePrintSelected function:
"use client";

// ... (previous imports remain the same)
function removeParentheses(str: string): string {
  return str.replace(/[()]/g, '');
}

// Inside the DataTable component, update the handlePrintSelected function:
const handlePrintSelected = () => {
  const selectedRows = table.getSelectedRowModel().rows;
  if (!selectedRows.length) {
    alert("يرجى تحديد صفوف لطباعة الفواتير.");
    return;
  }

  // try {
  //   const pdf = new jsPDF();

  //   pdf.addFileToVFS('Amiri-Regular-normal.ttf', AmiriFont); 
  //   pdf.addFont('Amiri-Regular-normal.ttf', 'Amiri', 'normal');
  //   pdf.addFileToVFS('Amiri-Bold-normal.ttf', AmiriBoldFont); 
  //   pdf.addFont('Amiri-Bold-normal.ttf', 'Amiri-Bold', 'bold');
  //   pdf.setFont('Amiri-Bold', 'bold');
  //   pdf.setTextColor(0, 0, 0);

  //   selectedRows.forEach((row, invoiceIndex) => {
  //     const invoice = row.original;

  //     const drawHeader = (pageNum: number, totalPages: number) => {
  //       pdf.setFontSize(16);
  //       pdf.setFontSize(10);
  //       pdf.text(`${pageNum}-${totalPages}`, pdf.internal.pageSize.getWidth() - 10, 10, { align: 'right' });
      
  //       if (pageNum === 1) {
  //         let currentY = 10;
  //         pdf.setFontSize(12);
  //         pdf.setFont('Amiri-Bold', 'bold');
  //         const formattedDate = new Date(invoice.date).toLocaleDateString('en-GB', {
  //           year: 'numeric',
  //           month: '2-digit',
  //           day: '2-digit',
  //         });
      
  //         pdf.text(`رقم الفاتورة: ${invoice.invoiceNumber}`, 10, currentY);
  //         pdf.text(`التاريخ: ${formattedDate}`, 80, currentY);
  //         pdf.text(` ${invoice.customerId?.serial || "4"}`, 100, currentY + 10);
  //         pdf.text(
  //           `اسم العميل: ${invoice.customerId?.name || ""}`,
  //           pdf.internal.pageSize.getWidth() - 80,
  //           currentY
  //         );
  //         currentY += 8;
      
  //         pdf.text(
  //           `الاسم التجاري: ${invoice.customerId?.tradName || ""}`,
  //           pdf.internal.pageSize.getWidth() - 80,
  //           currentY
  //         );
      
  //         currentY += 8;
  //         pdf.text(`المندوب: ${invoice.agentId?.name || ""}`, 10, currentY);
  //         pdf.text(
  //           `هاتف العميل: ${invoice.customerId?.phone || ""}`,
  //           pdf.internal.pageSize.getWidth() - 80,
  //           currentY
  //         );
      
  //         currentY += 8;
  //         pdf.text(
  //           `عنوان العميل: ${invoice.customerId?.address || ""}`,
  //           pdf.internal.pageSize.getWidth() - 80,
  //           currentY
  //         );
      
  //         return currentY + 10;
  //       }
  //       return 30;
  //     };
      
  //     const itemTableData = invoice.items.map((item, idx) => {
  //       const isOdd = idx % 2 === 0;
  //       return [
  //         isOdd ? item.productId.barcode : "",
  //         item.quantity,
  //         removeParentheses(item.productId.name),
  //         !isOdd ? item.productId.barcode : ""
  //       ];
  //     });

  //     const itemsPerPage = 30;
  //     const totalPages = Math.ceil(itemTableData.length / itemsPerPage);

  //     if (invoiceIndex > 0) {
  //       pdf.addPage();
  //     }

  //     const totalQuantity = invoice.items.reduce((sum, item) => sum + item.quantity, 0);

  //     (pdf as any).autoTable({
  //       startY: drawHeader(1, totalPages),
  //       head: [['باركود', 'Q','المنتج' , 'باركود']],
  //       body: itemTableData,
  //       styles: {
  //         font: 'Amiri-Bold',
  //         fontStyle: 'bold',
  //         fontSize: 14,
  //         halign: 'center',
  //         cellPadding: 2,
  //         lineWidth: 0.1,
  //         rowHeight: 12,
  //         textColor: [0, 0, 0]
  //       },
  //       headStyles: {
  //         fillColor: [255, 255, 255],
  //         textColor: [0, 0, 0],
  //         fontSize: 9,
  //         fontStyle: 'bold',
  //         halign: 'center'
  //       },
  //       columnStyles: {
  //         0: { cellWidth: 40 },
  //         1: { cellWidth: 40, halign: 'center' },
  //         2: { cellWidth: 'auto'  },
  //         3: { cellWidth: 40 }
  //       },
  //       didDrawCell: (data) => {
  //         if ((data.column.index === 0 || data.column.index === 3) && data.section === 'body') {
  //           const barcodeData = data.cell.raw;
  //           if (barcodeData) {
  //             try {
  //               const canvas = document.createElement("canvas");
  //               JsBarcode(canvas, barcodeData, {
  //                 format: "CODE128",
  //                 width: 1,
  //                 height: 1,
  //                 displayValue: false,
  //                 fontSize: 6,
  //                 margin: 1
  //               });
  //               const barcodeImg = canvas.toDataURL("image/png");
  //               const { x, y, width, height } = data.cell;
  //               pdf.addImage(barcodeImg, "PNG", x + 1, y + 1, width - 2, height - 2);
  //             } catch (barcodeError) {
  //               console.error(`Error generating barcode for ${barcodeData}:`, barcodeError);
  //             }
  //           }
  //         }
  //       },
  //       margin: { top: 45 }
  //     });

  //     const pageHeight = pdf.internal.pageSize.getHeight();
  //     pdf.setFontSize(10);
  //     pdf.text(`إجمالي المنتجات: ${totalQuantity}`, 10, pageHeight - 20);
  //     pdf.setFontSize(8);
  //     pdf.text("شكراً لتعاملكم معنا", pdf.internal.pageSize.getWidth() / 2, pageHeight - 10, { align: 'center' });
  //   });

  //   pdf.save("invoices.pdf");
  // } catch (error) {
  //   console.error("Error during PDF generation:", error);
  //   alert("حدث خطأ أثناء إنشاء ملف PDF");
  // }
};
  return (
    <div className="w-full">
      {/* Filters and Controls */}
      <div className="flex items-center py-4 space-x-4">
        {/* Customer Name Search */}
        <Input
          placeholder="بحث باسم العميل..."
          value={table.getColumn('customerName')?.getFilterValue() as string || ""}
          onChange={event => {
            const column = table.getColumn('customerName');
            if (column) {
              column.setFilterValue(event.target.value);
            } else {
              console.error(`Column 'customerName' not found.`);
            }
          }}
          className="max-w-sm"
        />

        {/* Agent Name Search */}
        <Input
          placeholder="بحث باسم الوكيل..."
          value={table.getColumn('agentName')?.getFilterValue() as string || ""}
          onChange={event => {
            const column = table.getColumn('agentName');
            if (column) {
              column.setFilterValue(event.target.value);
            } else {
              console.error(`Column 'agentName' not found.`);
            }
          }}
          className="max-w-sm"
        />

        {/* Date Filter Controls */}
        {/* <div className="flex items-center space-x-2">
          <Button
            variant={dateFilter === 'today' ? 'primary' : 'outline'}
            onClick={() => {
              setDateFilter(dateFilter === 'today' ? null : 'today');
            }}
          >
            اليوم
          </Button>
          <Button
            variant={dateFilter === 'thisWeek' ? 'primary' : 'outline'}
            onClick={() => {
              setDateFilter(dateFilter === 'thisWeek' ? null : 'thisWeek');
            }}
          >
            هذا الأسبوع
          </Button>
          <Button
            variant={dateFilter === 'custom' ? 'primary' : 'outline'}
            onClick={() => {
              setDateFilter(dateFilter === 'custom' ? null : 'custom');
            }}
          >
            نطاق زمني
          </Button>
          {dateFilter === 'custom' && (
            <div className="flex items-center space-x-2">
              <DatePicker
                selected={customDateRange[0]}
                onChange={(date: Date | null) => setCustomDateRange([date, customDateRange[1]])}
                selectsStart
                startDate={customDateRange[0]}
                endDate={customDateRange[1]}
                placeholderText="من"
                className="border rounded px-2 py-1"
              />
              <DatePicker
                selected={customDateRange[1]}
                onChange={(date: Date | null) => setCustomDateRange([customDateRange[0], date])}
                selectsEnd
                startDate={customDateRange[0]}
                endDate={customDateRange[1]}
                minDate={customDateRange[0]}
                placeholderText="إلى"
                className="border rounded px-2 py-1"
              />
              <Button onClick={applyDateFilter}>تطبيق</Button>
            </div>
          )}
        </div> */}

        {/* Column Visibility Controls */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              الأعمدة <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  className="capitalize"
                  checked={column.getIsVisible()}
                  onCheckedChange={(value) =>
                    column.toggleVisibility(!!value)
                  }
                >
                  {column.id}
                </DropdownMenuCheckboxItem>
              ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Print Selected Invoices Button */}
        <Button onClick={handlePrintSelected} variant="outline" className="ml-4">
          طباعة الفواتير المحددة
        </Button>
      </div>

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map(headerGroup => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <TableHead key={header.id}>
                    {header.column.getCanSort() ? (
                      <button
                        onClick={header.column.getToggleSortingHandler()}
                        className="flex items-center space-x-2"
                      >
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        {{
                          asc: <ChevronDown className="w-4 h-4" />,
                          desc: <ChevronDown className="w-4 h-4 rotate-180" />,
                        }[header.column.getIsSorted() as string] ?? null}
                      </button>
                    ) : (
                      flexRender(header.column.columnDef.header, header.getContext())
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map(row => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() ? "selected" : undefined}
                  onClick={() => onRowClick?.(row.original)}
                  className="cursor-pointer"
                >
                  {row.getVisibleCells().map(cell => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  لا توجد نتائج.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getSelectedRowModel().rows.length} من {table.getRowModel().rows.length} صفوف محددة.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            السابق
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            التالي
          </Button>
        </div>
      </div>
    </div>
  );
}
