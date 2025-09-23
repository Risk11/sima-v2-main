import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import { Delete, Edit } from "lucide-react";
import type { Field } from "@/components/dialog";

import apiService from "@/services/api-services";

import { AppSidebar } from "@/components/app-sidebar";
import DialogDemo from "@/components/dialog";
import { DataTable } from "@/components/data-table";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import Header from "../dashboard/header";

export type DetailApp = {
    id: number;
    versi_app: string;
    tgl_update: string;
    catatan: string;
    link_update: string;
    status: string;
};

type DetailAppFormData = Omit<DetailApp, 'id'>;

export default function DetailAppAndroPage() {
    const queryClient = useQueryClient();
    const [editData, setEditData] = useState<DetailApp | null>(null);

    const { data: detailsData, isLoading, isError } = useQuery({
        queryKey: ['detail-app-andros'],
        queryFn: () => apiService.get<DetailApp[]>('/detail-app-andros'),
    });
    const details = detailsData?.data ?? [];

    const saveMutation = useMutation({
        mutationFn: (formData: DetailAppFormData) => {
            if (editData) {
                return apiService.put(`/detail-app-andros/${editData.id}`, formData);
            }
            return apiService.post('/detail-app-andros', formData);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['detail-app-andros'] });
            setEditData(null);
        },
        onError: (error: any) => {
            alert(`Gagal menyimpan data: ${error.response?.data?.message || error.message}`);
        }
    });

    const deleteMutation = useMutation({
        mutationFn: (id: number) => apiService.delete(`/detail-app-andros/${id}`),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['detail-app-andros'] });
        },
        onError: (error: any) => {
            alert(`Gagal menghapus data: ${error.response?.data?.message || error.message}`);
        }
    });

    const handleDelete = (id: number) => {
        if (window.confirm("Anda yakin ingin menghapus detail ini?")) {
            deleteMutation.mutate(id);
        }
    };

    const fields: Field[] = [
        { id: "versi_app", label: "Versi Aplikasi", placeholder: "Contoh: 1.0.0" },
        { id: "tgl_update", label: "Tanggal Update", type: "text", placeholder: "YYYY-MM-DD" },
        { id: "catatan", label: "Catatan", placeholder: "Masukkan catatan atau changelog" },
        { id: "link_update", label: "Link Update", placeholder: "https://play.google.com/..." },
        { id: "status", label: "Status", type: "select", options: [{ id: 'aktif', label: 'Aktif' }, { id: 'tidak_aktif', label: 'Tidak Aktif' }] },
    ];

    const columns: ColumnDef<DetailApp>[] = [
        { id: "no", header: "No", cell: ({ row }) => row.index + 1 },
        {
            id: "aksi", header: "Aksi", cell: ({ row }) => (
                <div className="flex items-center gap-2">
                    <button onClick={() => setEditData(row.original)} className="hover:bg-slate-200 hover:text-black bg-[#106A82] p-1 rounded-md text-white" title="Edit Data">
                        <Edit className="w-5 h-5" />
                    </button>
                    <button onClick={() => handleDelete(row.original.id)} className="hover:bg-slate-200 hover:text-black bg-red-500 p-1 rounded-md text-white" title="Hapus Data">
                        <Delete className="w-5 h-5" />
                    </button>
                </div>
            ),
        },
        { accessorKey: "versi_app", header: "Versi" },
        { accessorKey: "tgl_update", header: "Tgl Update" },
        { accessorKey: "catatan", header: "Catatan" },
        { accessorKey: "link_update", header: "Link" },
        { accessorKey: "status", header: "Status", cell: ({ row }) => <div className="capitalize">{row.getValue("status")}</div> },
    ];

    return (
        <SidebarProvider className="font-poppins">
            <AppSidebar className="w-[200px]" />
            <SidebarInset className="bg-white">
                <Header />
                <div>
                    <div className="bg-white border border-[#E5E5E5] shadow-sm rounded-lg p-4 mx-5 my-5">
                        <div className="flex justify-between items-center">
                            <p className="font-semibold">Detail Aplikasi Android</p>
                            <DialogDemo
                                button="Tambah Detail"
                                title="Tambah Detail Aplikasi"
                                fields={fields}
                                onSubmit={(formData) => saveMutation.mutate(formData as DetailAppFormData)}
                            />
                        </div>
                        <div className="mt-5">
                            {isLoading ? <p>Memuat data...</p> : isError ? <p className="text-red-500">Gagal memuat data.</p> : <DataTable columns={columns} data={details} />}
                        </div>
                    </div>
                </div>
                {editData && (
                    <DialogDemo
                        open={!!editData}
                        onOpenChange={(open) => !open && setEditData(null)}
                        title="Edit Detail Aplikasi"
                        fields={fields}
                        initialData={editData}
                        onSubmit={(formData) => saveMutation.mutate(formData as DetailAppFormData)}
                    />
                )}
            </SidebarInset>
        </SidebarProvider>
    );
}
