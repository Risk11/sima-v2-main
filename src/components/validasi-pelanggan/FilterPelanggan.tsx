"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, RotateCcw } from "lucide-react";
import {
    PelangganFilters,
    FilterOptions,
} from "@/types/data";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface FilterPelangganProps {
    filters: PelangganFilters;
    filterOptions: FilterOptions;
    onFilterChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
    onFilterSubmit: (e: React.FormEvent) => void;
    onResetFilter: () => void;
    isFetching: boolean;
    loadingOptions: boolean;
}

const FilterPelanggan = ({
    filters,
    filterOptions,
    onFilterChange,
    onFilterSubmit,
    onResetFilter,
    isFetching,
    loadingOptions,
}: FilterPelangganProps) => {
    const [filterSearch, setFilterSearch] = useState({ kodeGardu: '', surveyor: '', project: '' });

    const handleFilterChange = (name: string, value: string) => {
        onFilterChange({ target: { name, value } } as React.ChangeEvent<HTMLSelectElement | HTMLInputElement>);
    };

    const filteredOptions = {
        kodeGardu: filterOptions.kodeGardu?.filter(option =>
            option.toLowerCase().includes(filterSearch.kodeGardu.toLowerCase())
        ) || [],
        surveyor: filterOptions.surveyor?.filter(option =>
            option.toLowerCase().includes(filterSearch.surveyor.toLowerCase())
        ) || [],
        project: filterOptions.project?.filter(option =>
            option.toLowerCase().includes(filterSearch.project.toLowerCase())
        ) || [],
    };

    return (
        <div className="border bg-card p-6 md:p-8">
            <h3 className="text-xl font-bold mb-6 text-center md:text-left">Pencarian sesuai kebutuhan🔍</h3>
            <form onSubmit={onFilterSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="space-y-2">
                        <Label htmlFor="tanggal" className="text-sm font-medium">Tanggal</Label>
                        <Input
                            id="tanggal"
                            type="date"
                            name="tanggal"
                            value={filters.tanggal}
                            onChange={onFilterChange}
                            className="w-full"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="no_kwh" className="text-sm font-medium">No. KWH</Label>
                        <Input
                            id="no_kwh"
                            type="text"
                            name="no_kwh"
                            value={filters.no_kwh}
                            onChange={onFilterChange}
                            placeholder="Masukkan No. KWH..."
                            className="w-full"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="id_pelanggan" className="text-sm font-medium">ID Pelanggan</Label>
                        <Input
                            id="id_pelanggan"
                            type="text"
                            name="id_pelanggan"
                            value={filters.id_pelanggan}
                            onChange={onFilterChange}
                            placeholder="Masukkan ID Pelanggan..."
                            className="w-full"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="kode_gardu" className="text-sm font-medium">Kode Gardu</Label>
                        <Select
                            name="kode_gardu"
                            value={filters.kode_gardu}
                            onValueChange={(value) => handleFilterChange('kode_gardu', value)}
                            disabled={loadingOptions}
                        >
                            <SelectTrigger id="kode_gardu" className="w-full">
                                <SelectValue placeholder={loadingOptions ? "Memuat..." : "Pilih Kode Gardu"} />
                            </SelectTrigger>
                            <SelectContent>
                                <div className="p-2">
                                    <Input
                                        placeholder="Cari Kode Gardu..."
                                        value={filterSearch.kodeGardu}
                                        onChange={(e) => setFilterSearch({ ...filterSearch, kodeGardu: e.target.value })}
                                        className="mb-2"
                                    />
                                </div>
                                <SelectItem value="all">Semua Kode Gardu</SelectItem>
                                {filteredOptions.kodeGardu.length > 0 ? (
                                    filteredOptions.kodeGardu.map((option) => (
                                        <SelectItem key={option} value={option}>
                                            {option}
                                        </SelectItem>
                                    ))
                                ) : (
                                    <div className="p-2 text-center text-sm text-gray-500">Tidak ada hasil ditemukan.</div>
                                )}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="nama_surveyor" className="text-sm font-medium">Nama Surveyor</Label>
                        <Select
                            name="nama_surveyor"
                            value={filters.nama_surveyor}
                            onValueChange={(value) => handleFilterChange('nama_surveyor', value)}
                            disabled={loadingOptions}
                        >
                            <SelectTrigger id="nama_surveyor" className="w-full">
                                <SelectValue placeholder={loadingOptions ? "Memuat..." : "Pilih Nama Surveyor"} />
                            </SelectTrigger>
                            <SelectContent>
                                <div className="p-2">
                                    <Input
                                        placeholder="Cari Nama Surveyor..."
                                        value={filterSearch.surveyor}
                                        onChange={(e) => setFilterSearch({ ...filterSearch, surveyor: e.target.value })}
                                        className="mb-2"
                                    />
                                </div>
                                <SelectItem value="all">Semua Nama Surveyor</SelectItem>
                                {filteredOptions.surveyor.length > 0 ? (
                                    filteredOptions.surveyor.map((option) => (
                                        <SelectItem key={option} value={option}>
                                            {option}
                                        </SelectItem>
                                    ))
                                ) : (
                                    <div className="p-2 text-center text-sm text-gray-500">Tidak ada hasil ditemukan.</div>
                                )}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="nama_project" className="text-sm font-medium">Nama Project</Label>
                        <Select
                            name="nama_project"
                            value={filters.nama_project}
                            onValueChange={(value) => handleFilterChange('nama_project', value)}
                            disabled={loadingOptions}
                        >
                            <SelectTrigger id="nama_project" className="w-full">
                                <SelectValue placeholder={loadingOptions ? "Memuat..." : "Pilih Nama Project"} />
                            </SelectTrigger>
                            <SelectContent>
                                <div className="p-2">
                                    <Input
                                        placeholder="Cari Nama Project..."
                                        value={filterSearch.project}
                                        onChange={(e) => setFilterSearch({ ...filterSearch, project: e.target.value })}
                                        className="mb-2"
                                    />
                                </div>
                                <SelectItem value="all">Semua Nama Project</SelectItem>
                                {filteredOptions.project.length > 0 ? (
                                    filteredOptions.project.map((option) => (
                                        <SelectItem key={option} value={option}>
                                            {option}
                                        </SelectItem>
                                    ))
                                ) : (
                                    <div className="p-2 text-center text-sm text-gray-500">Tidak ada hasil ditemukan.</div>
                                )}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <div className="flex flex-col sm:flex-row justify-end gap-3 mt-6">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onResetFilter}
                        disabled={isFetching || loadingOptions}
                        className="w-full sm:w-auto"
                    >
                        <RotateCcw className="mr-2 h-4 w-4" /> Reset Filter
                    </Button>
                    <Button
                        variant="blue"
                        type="submit"
                        disabled={isFetching || loadingOptions}
                        className="w-full sm:w-auto"
                    >
                        <Search className="mr-2 h-4 w-4" />
                        {isFetching ? "Mencari..." : "Cari Data"}
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default FilterPelanggan;