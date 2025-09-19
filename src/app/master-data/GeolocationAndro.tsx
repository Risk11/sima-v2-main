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

export type Geolocation = {
    id: number;
    fid?: string;
    alamat?: string;
};

type GeolocationFormData = Omit<Geolocation, 'id'>;

export default function GeolocationAndro() {
    const queryClient = useQueryClient();
    const [editData, setEditData] = useState<Geolocation | null>(null);

    const { data: geoData, isLoading, isError } = useQuery({
        queryKey: ['geolocation-andros'],
        queryFn: () => apiService.get<Geolocation[]>('/geolocation-andros'),
    });
    const geolocations = geoData?.data ?? [];

    const saveMutation = useMutation({
        mutationFn: (formData: GeolocationFormData) => {
            if (editData) {
                return apiService.put(`/geolocation-andros/${editData.id}`, formData);
            }
            return apiService.post('/geolocation-andros', formData);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['geolocation-andros'] });
            setEditData(null);
        },
        onError: (error: any) => {
            alert(`Gagal menyimpan data: ${error.response?.data?.message || error.message}`);
        }
    });

    const deleteMutation = useMutation({
        mutationFn: (id: number) => apiService.delete(`/geolocation-andros/${id}`),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['geolocation-andros'] });
        },
        onError: (error: any) => {
            alert(`Gagal menghapus data: ${error.response?.data?.message || error.message}`);
        }
    });

    const handleDelete = (id: number) => {
        if (window.confirm("Yakin hapus data ini?")) {
            deleteMutation.mutate(id);
        }
    };

    const fields: Field[] = [
        { id: "fid", label: "FID", placeholder: "Masukan FID", type: "text" },
        { id: "alamat", label: "Alamat", placeholder: "Masukan Alamat", type: "text" },
    ];

    const columns: ColumnDef<Geolocation>[] = [
        { id: "id", header: "ID", accessorKey: "id" },
        { id: "fid", header: "FID", accessorKey: "fid" },
        { id: "alamat", header: "Alamat", accessorKey: "alamat" },
        {
            id: "aksi", header: "Aksi", cell: ({ row }) => (
                <div className="flex items-center gap-2">
                    <button onClick={() => setEditData(row.original)} className="hover:bg-slate-200 hover:text-black bg-[#106A82] p-1 rounded-md text-white transition" title="Edit Data">
                        <Edit className="w-5 h-5" />
                    </button>
                    <button onClick={() => handleDelete(row.original.id)} className="hover:bg-slate-200 hover:text-black bg-red-500 p-1 rounded-md text-white transition" title="Hapus Data">
                        <Delete className="w-5 h-5" />
                    </button>
                </div>
            ),
        },
    ];

    return (
        <SidebarProvider className="font-poppins">
            <AppSidebar className="w-[200px]" />
            <SidebarInset className="bg-gradient-to-b from-[#FCFCFC] to-[#D9E3EA]">
                <Header />
                <div className="bg-white border border-[#E5E5E5] shadow-sm rounded-lg p-4 mx-5 my-5">
                    <div className="flex justify-between items-center">
                        <p className="font-semibold">Daftar Geolocation Andro</p>
                        <DialogDemo
                            button="Tambah Data"
                            title="Tambah Data Geolocation"
                            fields={fields}
                            onSubmit={(formData) => saveMutation.mutate(formData as GeolocationFormData)}
                            buttonColor="hover:bg-slate-200 hover:text-black bg-[#106A82] p-1 rounded-md text-white"
                        />
                    </div>
                    <div className="mt-5">
                        {isLoading ? <p>Memuat data...</p> : isError ? <p className="text-red-500">Gagal memuat data.</p> : <DataTable columns={columns} data={geolocations} />}
                    </div>
                </div>
                {editData && (
                    <DialogDemo
                        open={!!editData}
                        onOpenChange={(open) => !open && setEditData(null)}
                        button="Simpan"
                        title="Edit Data Geolocation"
                        fields={fields}
                        initialData={editData}
                        onSubmit={(formData) => saveMutation.mutate(formData as GeolocationFormData)}
                        buttonColor="bg-blue-600 text-white hover:bg-blue-700"
                    />
                )}
            </SidebarInset>
        </SidebarProvider>
    );
}
