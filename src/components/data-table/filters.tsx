import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu.tsx'
import { Button } from '@/components/ui/button.tsx'
import { Filter } from 'lucide-react'
import { Label } from '@/components/ui/label.tsx'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.tsx'
import { capitalizeFirstLetter, cn } from '@/lib/utils.ts'
import { Input } from '@/components/ui/input.tsx'
import { ChangeEvent, useState } from 'react'
import { ScrollArea } from '@/components/ui/scroll-area.tsx'
import { useSearch } from '@tanstack/react-router'
import { Filters, ParamState } from '@/types/data-table'
import { DatePicker } from '../date-picker'

export default function DataTableFilters({
  filters,
  setParams,
  resetParams,
  withUp3Filters
}: {
  filters?: Filters[],
  setParams: (params: Record<string, ParamState>) => Promise<void>,
  resetParams: () => Promise<void>,
  withUp3Filters?: boolean
}) {
  const search = useSearch({
    strict: false
  })

  const [filterValues, setFilterValues] = useState<Record<string, ParamState>>(() => {
    const initialFilters = filters
      ? {
        ...filters.reduce((acc, filter) => {
          if (filter.type === "min-max") {
            acc[`min${filter.id}`] = filter.defaultValue[0]
            acc[`max${filter.id}`] = filter.defaultValue[1]
          } else {
            acc[filter.id] = filter.defaultValue as ParamState
          }
          return acc
        }, {} as { [key: string]: ParamState }),
      }
      : {}

    if (withUp3Filters) {
      initialFilters.up3 = search.up3
    }

    return initialFilters
  })

  const handleChange = (value: ParamState, id: string) => {
    const numericValue = Number(value)

    setFilterValues({
      ...filterValues,
      [id]: !isNaN(numericValue) ? numericValue : value
    })
  }

  const handleMinMaxChange = ({ target }: ChangeEvent<HTMLInputElement>) => {
    setFilterValues({
      ...filterValues,
      [target.id]: Number(target.value)
    })
  }

  const handleResetClick = () => {
    setFilterValues(prevState => {
      const newState = { ...prevState }

      Object.keys(newState).forEach(key => {
        newState[key] = undefined
      })

      return newState
    })

    resetParams()
  }

  return (
    <DropdownMenu modal={true}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="hidden ml-3 lg:block hover:bg-sidebar"
        >
          <Filter />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="pt-2 px-3 w-[360px]">
        <div className="flex items-center justify-between">
          <DropdownMenuLabel className="text-base">Filter</DropdownMenuLabel>
          <Button
            variant="link"
            size="sm"
            className="text-destructive"
            onClick={handleResetClick}
          >
            Atur ulang
          </Button>
        </div>
        <DropdownMenuSeparator className="my-2" />
        <ScrollArea className="mt-3 mb-4" type="hover">
          <div className="space-y-4 px-2 max-h-80">
            {filters &&
              filters.map((filter, idx) => {
                const { id, label, type } = filter

                if (type === "select") {
                  return (
                    <div key={idx} className="space-y-2">
                      <Label htmlFor={id}>{label}</Label>
                      <Select
                        onValueChange={(value) => handleChange(value, id)}
                        value={filterValues[id] as string ?? ""}
                      >
                        <SelectTrigger
                          id={id}
                          className={cn(!filterValues[id] && "text-muted-foreground")}
                        >
                          <SelectValue placeholder={`Pilih ${label.toLowerCase()}`} />
                        </SelectTrigger>
                        <SelectContent>
                          <ScrollArea type="always">
                            <div className="max-h-52">
                              {filter.options.map((option, optionIdx) => (
                                <SelectItem key={optionIdx} value={option.value as string}>
                                  {option.label}
                                </SelectItem>
                              ))}
                            </div>
                          </ScrollArea>
                        </SelectContent>
                      </Select>
                    </div>
                  )
                }

                if (type === "date") {
                  return (
                    <div key={idx} className="space-y-2">
                      <Label>{label}</Label>
                      <div className="flex space-x-4">
                        <DatePicker placeholder="Minimal" />
                        <DatePicker placeholder="Maksimal" />
                      </div>
                    </div>
                  )
                }

                if (type === "min-max") {
                  return (
                    <div key={idx} className="space-y-2">
                      <Label htmlFor={`min${capitalizeFirstLetter(id)}`}>{label}</Label>
                      <div className="flex items-center space-x-4">
                        <Input
                          id={`min${capitalizeFirstLetter(id)}`}
                          type="number"
                          placeholder="Minimal"
                          min={0}
                          value={filterValues[`min${capitalizeFirstLetter(id)}`] as string ?? ""}
                          onChange={handleMinMaxChange}
                        />
                        <Input
                          id={`max${capitalizeFirstLetter(id)}`}
                          type="number"
                          placeholder="Maksimal"
                          min={0}
                          value={filterValues[`max${capitalizeFirstLetter(id)}`] as string ?? ""}
                          onChange={handleMinMaxChange}
                        />
                      </div>
                    </div>
                  )
                }

                return (
                  <div key={idx} className="space-y-2">
                    <Label htmlFor={id}>{label}</Label>
                    <div className="flex items-center">
                      <Input
                        {...filter}
                        placeholder={`Masukkan ${label.toLowerCase()}`}
                        value={filterValues[id] as string ?? ""}
                        onChange={({ target }) => handleChange(target.value, id)}
                      />
                    </div>
                  </div>
                )
              })}
            <div className="pt-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setParams(filterValues)}
              >
                Terapkan
              </Button>
            </div>
          </div>
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}