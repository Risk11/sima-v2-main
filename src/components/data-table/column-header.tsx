import { Column } from "@tanstack/react-table"
import { ArrowDown, ArrowUp, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { HTMLAttributes } from "react"

export function DataTableColumnHeader<TData, TValue>({
  column,
  title,
  className,
}: {
  column: Column<TData, TValue>
  title: string
} & HTMLAttributes<HTMLDivElement>) {
  if (!column.getCanSort()) {
    return <div className={cn(className)}>{title}</div>
  }

  const sortDirection = column.getIsSorted()

  return (
    <div className={cn("flex items-center text-md space-x-2", className)}>
      <Button
        variant="ghost"
        size="sm"
        className="-ml-3 h-8 text-sm"
        onClick={() => column.toggleSorting()}
      >
        <span>{title}</span>
        {sortDirection === "asc" && <ArrowUp className="ml-2 h-4 w-4" />}
        {sortDirection === "desc" && <ArrowDown className="ml-2 h-4 w-4" />}
        {!sortDirection && <ChevronsUpDown className="ml-2 h-4 w-4 text-muted-foreground/50" />}
      </Button>
    </div>
  )
}
