import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  Row,
  useReactTable,
} from '@tanstack/react-table'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table.tsx"
import DataTablePagination from '@/components/data-table/pagination.tsx'
import DataTableHeader from '@/components/data-table/header.tsx'
import { RegisteredRouter, RouteIds } from '@tanstack/react-router'
import { sortByToState, stateToSortBy } from '@/lib/utils.ts'
import { DataTableColumnHeader } from '@/components/data-table/column-header.tsx'
import { ReactNode, useRef, useState } from 'react'
import { ScrollArea, ScrollBar } from '../ui/scroll-area'
import clsx from 'clsx'
import { Filters, TableAction } from '@/types/data-table'
import { useParams } from '@/hooks/use-params'

export const DEFAULT_PAGE_INDEX = 0
export const DEFAULT_PAGE_SIZE = 10

export type ParamState = string | number | boolean | undefined

export function DataTable<TData, TValue>({
  data,
  columns,
  rowCount,
  filters,
  withUp3Filters,
  className,
  rowClassName,
}: {
  data: TData[],
  columns: ColumnDef<TData, TValue>[],
  rowCount?: number,
  routeId?: RouteIds<RegisteredRouter["routeTree"]>,
  actions?: TableAction[],  
  queryKey?: string,
  navigate?: string, 
  endpoint?: string,
  filters?: Filters[],
  withUp3Filters?: boolean,
  withUp3Column?: boolean,
  className?: string;
  additionalActions?: (id: number) => ReactNode;
  rowClassName?: (row: Row<TData>) => string; 
  onSearch?: (value: string) => void
}) {

  const { params, setParams, resetParams } = useParams()
  const [globalFilter, setGlobalFilter] = useState('')
  const bottomRef = useRef<HTMLDivElement>(null)

  const paginationState = {
    pageIndex: params.page ? Number(params.page) - 1: DEFAULT_PAGE_INDEX,
    pageSize: Number(params.size) || DEFAULT_PAGE_SIZE,
  }

  const sortingState = sortByToState(params.sortBy as `${string}.asc` | `${string}.desc`)  

  const table = useReactTable({
    data,
    columns,
    rowCount,
    state: {
      pagination: paginationState,
      sorting: sortingState,
      globalFilter
    },
    manualPagination: true,
    manualSorting: true,
    onPaginationChange: (pagination) => {
      const newState =
        typeof pagination === 'function'
          ? pagination(paginationState)
          : pagination
    
      setParams({
        page: String(newState.pageIndex + 1),
        size: String(newState.pageSize),
      })
    },
    onSortingChange: (updaterOrValue) => {
      const newSortingState =
        typeof updaterOrValue === 'function'
          ? updaterOrValue(sortingState)
          : updaterOrValue
    
      setParams({ sortBy: stateToSortBy(newSortingState) })
    },
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: 'includesString',
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  })

  return (
    <div className="rounded-lg border overflow-x-auto w-full">
      <DataTableHeader 
        table={table} 
        resetParams={resetParams}
        filters={filters}
        withUp3Filters={withUp3Filters}
      />
      <ScrollArea className="p-1.5 w-full">
        <div className="min-w-[700px]"> 
          <Table className={className}>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead
                      key={header.id}
                      className="bg-sidebar text-primary whitespace-nowrap"
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.enableSorting ? (
                              <DataTableColumnHeader
                                column={header.column}
                                title={String(header.column.columnDef.header)}
                              />
                            ) : (
                              header.column.columnDef.header
                            ),
                            header.getContext()
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                    className={rowClassName?.(row)}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell
                        key={cell.id}
                        className={clsx(
                          "whitespace-pre-line break-words",
                          cell.column.id === "keterangan" && "min-w-[250px] max-w-[300px]",
                          cell.column.id === "no" && "min-w-[10px] max-w-[50px]", 
                          cell.column.id === "select" && "w-[40px]",
                          cell.column.id !== "keterangan" &&
                            cell.column.id !== "no" &&
                            cell.column.id !== "select" &&
                            "min-w-[100px] max-w-[350px]"
                        )}
                      >
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-44  text-center">
                    Tidak ada hasil yang ditemukan
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
      <div ref={bottomRef}></div>
      {data.length > 0 && <DataTablePagination table={table} />}
    </div>
  )
}