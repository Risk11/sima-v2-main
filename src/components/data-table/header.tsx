import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.tsx'
import { Input } from '@/components/ui/input.tsx'
import { Table } from '@tanstack/react-table'
import { DataTableViewOptions } from '@/components/data-table/view-options.tsx'
import { Filters } from '@/types/data-table'
import { useEffect, useState } from 'react'

export default function DataTableHeader<TData>({
  table,
  setParams,
}: {
  table: Table<TData>,
  setParams?: (partialParams: Record<string, any>) => Promise<void>,
  resetParams: () => Promise<void>,
  filters?: Filters[],
  withUp3Filters?: boolean
}) {
  const { pageSize } = table.getState().pagination;
  const { globalFilter } = table.getState();


  const [search, setSearch] = useState(globalFilter ?? '')
  const [selectedDate, setSelectedDate] = useState<string>('')

  useEffect(() => {
    const timeout = setTimeout(() => {
      table.setGlobalFilter(search)
    }, 300)

    return () => clearTimeout(timeout)
  }, [search, table])

  useEffect(() => {
    if (setParams && selectedDate) {
      setParams({ tanggal: selectedDate })
    }
  }, [selectedDate, setParams])

  return (
    <div className="p-3.5 border-b flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <p className="text-sm">Baris per halaman</p>
          <Select
            value={String(pageSize)}
            onValueChange={(value) => {
              table.setPageSize(Number(value))
            }}
          >
            <SelectTrigger className="h-9 w-[70px]">
              <SelectValue placeholder={String(pageSize)} />
            </SelectTrigger>
            <SelectContent side="top">
              {[10, 20, 30, 40, 50].map((size) => (
                <SelectItem key={size} value={String(size)}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex items-center gap-2 w-full md:w-auto">
        {/* Input Tanggal */}
        <Input
          type="date"
          className="h-9 w-fit"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
        />

        {/* Search */}
        <Input
          className="h-9 w-full md:w-[250px]"
          placeholder="Cari data..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <DataTableViewOptions table={table} />
      </div>
    </div>
  )
}
