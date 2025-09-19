import { Table } from "@tanstack/react-table"
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react"

import { Button } from "@/components/ui/button"

export default function DataTablePagination<TData>({
  table
}: {
  table: Table<TData>
}) {
  const { pageIndex, pageSize } = table.getState().pagination;

  return (
    <div className="flex items-center justify-between p-3.5 border-t">
      <div className="text-sm">
        Menampilkan {" "}
        <span className="font-medium">
          {pageIndex * pageSize + 1} - {Math.min((pageIndex + 1) * pageSize, table.getRowCount())}
        </span>
        {" "} dari {" "}
        <span className="font-medium">
          {table.getRowCount()}
        </span>
        {" "} hasil
      </div>
      <div className="flex items-center space-x-6 lg:space-x-8">
        <div className="flex items-center justify-center text-sm">
          Halaman
          <span className="font-medium mx-1">
            {pageIndex + 1}
          </span>
          dari
          <span className="font-medium ml-1">
            {table.getPageCount()}
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            <span className="sr-only">Pergi ke halaman pertama</span>
            <ChevronsLeft/>
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <span className="sr-only">Pergi ke halaman terakhir</span>
            <ChevronLeft/>
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <span className="sr-only">Pergi ke halaman selanjutnya</span>
            <ChevronRight/>
          </Button>
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            <span className="sr-only">Pergi ke halaman sebelumnya</span>
            <ChevronsRight/>
          </Button>
        </div>
      </div>
    </div>
  )
}