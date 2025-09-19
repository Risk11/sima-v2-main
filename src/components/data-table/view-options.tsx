import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu"
import { Table } from "@tanstack/react-table"
import { Settings2 } from 'lucide-react'
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"

interface DataTableViewOptionsProps<TData> {
  table: Table<TData>
}

export function DataTableViewOptions<TData>({
  table,
}: DataTableViewOptionsProps<TData>) {
  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="hidden ml-1.5 lg:block hover:bg-sidebar"
        >
          <Settings2 />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[150px]">
        <DropdownMenuLabel>Kolom</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {table
          .getAllColumns()
          .filter(
            (column) =>
              typeof column.accessorFn !== "undefined" && column.getCanHide() && column.columnDef.id !== "OBJECTID"
          )
          .map((column) => {
            return (
              <DropdownMenuCheckboxItem
                key={column.id}
                className="capitalize"
                checked={column.getIsVisible()}
                onCheckedChange={(value) => column.toggleVisibility(value)}
              >
                {String(column.columnDef.header)}
              </DropdownMenuCheckboxItem>
            )
          })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
