"use client";

import { Input } from "@/components/ui/input";
import { Table } from "@tanstack/react-table";
import { useEffect, useState } from "react";
import useDebounce from "@/hooks/use-debounce";

interface DataTableSearchProps<TData> {
  table?: Table<TData>;
  search?: string; // state search dari halaman
  onSearch?: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export default function DataTableSearch<TData>({
  table,
  search = "",
  onSearch,
  placeholder = "Cari...",
  className = "",
}: DataTableSearchProps<TData>) {
  const [localSearch, setLocalSearch] = useState(search);
  const debouncedSearch = useDebounce(localSearch, 300);

  // Update localSearch jika props search berubah dari luar
  useEffect(() => {
    setLocalSearch(search);
  }, [search]);

  useEffect(() => {
    if (onSearch) {
      onSearch(debouncedSearch);
    } else if (table) {
      table.setGlobalFilter(debouncedSearch);
    }
  }, [debouncedSearch, onSearch, table]);

  return (
    <div className={`w-full max-w-sm ${className}`}>
      <Input
        placeholder={placeholder}
        value={localSearch}
        onChange={(e) => setLocalSearch(e.target.value)}
        className="w-full"
      />
    </div>
  );
}
