"use client";

import { useMemo, useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Toaster, toast } from 'sonner';
import { Button } from "@/components/ui/button";
import { Loader2, ChevronLeft, ChevronRight, Eye } from "lucide-react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import FilterPelanggan from "@/components/validasi-pelanggan/FilterPelanggan";
import ModalValidasi from "@/components/validasi-pelanggan/ModalValidasi";
import DataTable from "@/components/validasi-pelanggan/DataTable";
import { usePelangganData } from "@/hooks/usePelangganData";
import { ValidasiPelanggan } from "@/types/data";

const ValidasiPelangganPage = () => {
    const {
        data,
        loading,
        loadingOptions,
        filters,
        filterOptions,
        handleFilterChange,
        handleFilterSubmit,
        handleResetFilter,
        updatePelangganInList,
        page,
        perPage,
        total,
        setPage,
        setPerPage,
    } = usePelangganData();

    const [selectedPelanggan, setSelectedPelanggan] = useState<ValidasiPelanggan | null>(null);
    const [isButtonLoading, setIsButtonLoading] = useState<string | null>(null);

    const handleValidateAndShowModal = async (pelangganToValidate: ValidasiPelanggan) => {
        if (!pelangganToValidate.idpel) return;

        setIsButtonLoading(pelangganToValidate.idpel);

        try {
            const res = await fetch(`/api/validasi/validation/${pelangganToValidate.idpel}`, {
                method: "GET",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json"
                },
                credentials: "omit",
            });

            if (!res.ok) {
                throw new Error(`Server error: ${res.status}`);
            }

            const json = await res.json();
            if (!json.success || !json.data) {
                throw new Error(json.message || "Data pelanggan tidak valid.");
            }

            const photosFromApi = (json.data as any).photos || (json.data as any).PHOTOS || null;
            const photosArray = photosFromApi ? (Array.isArray(photosFromApi) ? photosFromApi : [photosFromApi]) : [];

            const updatedPelanggan: ValidasiPelanggan = {
                ...pelangganToValidate,
                status_dil: json.data.status_dil || pelangganToValidate.status_dil,
                photos: photosArray,
                validasi: json.data.validasi || pelangganToValidate.validasi,
            };

            updatePelangganInList(updatedPelanggan);
            setSelectedPelanggan(updatedPelanggan);
            toast.success("Validasi berhasil! Status DIL diperbarui.");
        } catch (err: any) {
            toast.error("Terjadi kesalahan saat validasi.");
            console.error(err);
        } finally {
            setIsButtonLoading(null);
        }
    };

    const handleOpenModal = (pelanggan: ValidasiPelanggan) => {
        setSelectedPelanggan(pelanggan);
    };

    const handlePerPageChange = (value: string) => {
        setPerPage(Number(value));
        setPage(1);
    };

    const columns = useMemo<ColumnDef<ValidasiPelanggan>[]>(() => [
        {
            id: "no_urut",
            header: "No",
            cell: ({ row }) => (
                <div className="font-medium text-center">{row.index + 1 + (page - 1) * perPage}</div>
            ),
            meta: { className: "w-12 text-center" }
        },
        { accessorKey: "tanggal", header: "TANGGAL" },
        { accessorKey: "status", header: "VALIDASI" },
        { accessorKey: "idpel", header: "ID PELANGGAN" },
        { accessorKey: "nomor_meter_kwh", header: "NO KWH" },
        { accessorKey: "nama_project", header: "NAMA PROJECT" },
        { accessorKey: "status_dil", header: "STATUS DIL" },
        { accessorKey: "validasi", header: "STATUS VALIDASI" },
        { accessorKey: "nama_surveyor", header: "NAMA SURVEYOR" },
        { accessorKey: "kode_gardu", header: "KODE GARDU" },
        {
            id: "actions",
            header: "Aksi",
            cell: ({ row }) => {
                const isCurrentRowLoading = isButtonLoading === row.original.idpel;
                return (
                    <div className="flex space-x-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleOpenModal(row.original)}
                            disabled={loading}
                        >
                            <Eye className="mr-2 h-4 w-4" /> Lihat
                        </Button>
                        <Button
                            variant="blue"
                            size="sm"
                            onClick={() => handleValidateAndShowModal(row.original)}
                            disabled={isCurrentRowLoading || loading}
                        >
                            {isCurrentRowLoading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                            {isCurrentRowLoading ? "Memvalidasi..." : "Validasi"}
                        </Button>
                    </div>
                );
            },
        },
    ], [isButtonLoading, loading, page, perPage]);

    return (
        <div className="container mx-auto py-8 px-4">
            <Toaster richColors position="top-right" />
            <div className="bg-white rounded-lg shadow-md p-8">
                <h1 className="text-3xl font-bold tracking-tight mb-6">Validasi Pelanggan</h1>
                <p className="text-gray-500 mb-8">Kelola dan validasi data pelanggan survei.</p>

                <FilterPelanggan
                    filters={filters}
                    filterOptions={filterOptions}
                    onFilterChange={handleFilterChange}
                    onFilterSubmit={handleFilterSubmit}
                    onResetFilter={handleResetFilter}
                    isFetching={loading}
                    loadingOptions={loadingOptions}
                />

                <div className="mt-8">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center p-20 text-gray-500">
                            <Loader2 className="w-12 h-12 animate-spin mb-4 text-blue-500" />
                            <p className="text-xl font-medium">Memuat data, harap tunggu...</p>
                        </div>
                    ) : (
                        <>
                            <div className="flex flex-col sm:flex-row justify-between items-center mt-6 p-4 rounded-md bg-white-50">
                                <div className="flex items-center space-x-2">
                                    <span className="text-sm text-gray-700">Tampilkan</span>
                                    <Select
                                        value={perPage.toString()}
                                        onValueChange={handlePerPageChange}
                                    >
                                        <SelectTrigger className="w-[80px]">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="10">10</SelectItem>
                                            <SelectItem value="20">20</SelectItem>
                                            <SelectItem value="25">25</SelectItem>
                                            <SelectItem value="50">50</SelectItem>
                                            <SelectItem value="100">100</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <DataTable columns={columns} data={data} />
                            <div className="flex flex-col sm:flex-row justify-between items-center mt-6 p-4 rounded-md bg-white-50">
                                <span className="text-sm text-gray-700 mb-2 sm:mb-0">
                                    Halaman <span className="font-semibold text-blue-600">{page}</span> dari {total} data
                                </span>
                                <div className="flex space-x-2">
                                    <Button
                                        onClick={() => setPage(Math.max(1, page - 1))}
                                        disabled={page === 1 || loading || isButtonLoading !== null}
                                        variant="outline"
                                        size="sm"
                                    >
                                        <ChevronLeft className="h-4 w-4" />
                                        <span className="sr-only sm:not-sr-only">Sebelumnya</span>
                                    </Button>
                                    <Button
                                        onClick={() => setPage(page + 1)}
                                        disabled={data.length < perPage || loading || isButtonLoading !== null}
                                        variant="outline"
                                        size="sm"
                                    >
                                        <span className="sr-only sm:not-sr-only">Berikutnya</span>
                                        <ChevronRight className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>

            {selectedPelanggan && (
                <ModalValidasi
                    pelanggan={selectedPelanggan}
                    onClose={() => setSelectedPelanggan(null)}
                    onSave={updatePelangganInList}
                />
            )}
        </div>
    );
};

export default ValidasiPelangganPage;
