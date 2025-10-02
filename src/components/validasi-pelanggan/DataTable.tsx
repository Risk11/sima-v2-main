// src/components/validasi-pelanggan/DataTable.tsx
"use client";

import React from "react";
import {
    ColumnDef,
    useReactTable,
    getCoreRowModel,
    flexRender,
} from "@tanstack/react-table";
import { ValidasiPelanggan } from "@/types/data";

interface CustomDataTableProps {
    columns: ColumnDef<ValidasiPelanggan>[];
    data: ValidasiPelanggan[];
}

const statusStyles: { [key: string]: string } = {
    DIL: "bg-green-100 text-green-800",
    DIKUNCI: "bg-gray-200 text-gray-800",
    DIL_IDPEL: "bg-blue-100 text-blue-800",
    DIL_NOKWH: "bg-yellow-100 text-yellow-800",
    "Belum Lengkap": "bg-red-100 text-red-800",
};

const DataTable = ({ columns, data }: CustomDataTableProps) => {
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    if (data.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center p-12 text-gray-500">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16 mb-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.25a.75.75 0 00-.75-.75h-2.25a.75.75 0 00-.75.75v2.25m3 0h-3m-12 3h1.5l1.5-3m-6 3l.75-1.5m6.75 1.5l.75 1.5M4.5 9.75h3m-3 0V9a1.5 1.5 0 013 0v.75m-3 0a1.5 1.5 0 013 0m7.5-3.75a.75.75 0 00-.75-.75h-2.25a.75.75 0 00-.75.75v2.25m3 0h-3" />
                </svg>
                <p className="text-lg font-semibold">Tidak ada data ditemukan.</p>
                <p className="text-sm">Silakan coba filter lain atau periksa kembali data Anda.</p>
            </div>
        );
    }

    return (
        <div className="w-full overflow-hidden rounded-md border bg-white">
            <div className="overflow-x-auto">
                <table className="w-full caption-bottom text-sm">
                    <thead className="[&_tr]:border-b">
                        {table.getHeaderGroups().map(headerGroup => (
                            <tr key={headerGroup.id} className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                {headerGroup.headers.map(header => (
                                    <th
                                        key={header.id}
                                        className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0"
                                    >
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
                    <tbody className="[&_tr:last-child]:border-0">
                        {table.getRowModel().rows.map(row => (
                            <tr key={row.id} className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                {row.getVisibleCells().map(cell => {
                                    const cellValue = cell.getValue() as string;
                                    let displayValue: React.ReactNode = cellValue;
                                    const accessorKey = (cell.column.columnDef as any).accessorKey;
                                    const id = (cell.column.columnDef as any).id;

                                    if (id === "no_urut") {
                                        displayValue = flexRender(cell.column.columnDef.cell, cell.getContext());
                                    } else if (accessorKey === "status_dil" && typeof cellValue === "string") {
                                        const style = statusStyles[cellValue] || "bg-gray-100 text-gray-800";
                                        displayValue = (
                                            <span
                                                className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${style}`}
                                            >
                                                {cellValue}
                                            </span>
                                        );
                                    } else {
                                        displayValue = flexRender(cell.column.columnDef.cell, cell.getContext());
                                    }

                                    return (
                                        <td
                                            key={cell.id}
                                            className="p-4 align-middle [&:has([role=checkbox])]:pr-0"
                                        >
                                            {displayValue}
                                        </td>
                                    );
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default DataTable;