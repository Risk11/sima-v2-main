import { useState, useMemo, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import { Delete, Edit, BellRing } from "lucide-react";
import type { Field } from "@/components/dialog";

import apiService from "@/services/api-services";

/* import { AppSidebar } from "@/components/app-sidebar"; */
import DialogDemo from "@/components/dialog";
import { DataTable } from "@/components/data-table";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
/* import Header from "../dashboard/header"; */

export type User = { id: number; nama: string };
export type Up3 = { id: number; nama_up3: string };
export type Gardu = { id: number; nama_gardu: string };
export type Notifikasi = {
    id: number;
    pembuat_id: number;
    up3_id: number;
    gardu_id: number;
    keterangan: string;
    status: string;
    lat?: number | null;
    lng?: number | null;
    tanggal: string;
    pembuat?: User;
    up3?: Up3;
    gardu?: Gardu;
};

const StatusBadge = ({ status }: { status: string }) => {
    const statusClasses = useMemo(() => {
        switch (status?.toLowerCase()) {
            case 'open': return 'bg-blue-100 text-blue-800';
            case 'closed': return 'bg-green-100 text-green-800';
            case 'pending': return 'bg-yellow-100 text-yellow-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    }, [status]);
    return <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusClasses}`}>{status}</span>;
};

export default function NotifikasiPage() {
    const queryClient = useQueryClient();
    const [editData, setEditData] = useState<Notifikasi | null>(null);
    const [currentUser, setCurrentUser] = useState<User | null>(null);

    useEffect(() => {
        const userDataString = localStorage.getItem('user');
        if (userDataString) {
            try {
                setCurrentUser(JSON.parse(userDataString));
            } catch (e) {
                console.error("Gagal parse data user dari localStorage", e);
            }
        }
    }, []);

    const { data: notifData, isLoading, isError } = useQuery({
        queryKey: ['notifikasis'],
        queryFn: () => apiService.get<Notifikasi[]>('/notifikasis'),
    });
    const notifikasis = notifData?.data ?? [];

    const { data: usersData } = useQuery({ queryKey: ['users'], queryFn: () => apiService.get<User[]>('/users') });
    const { data: up3sData } = useQuery({ queryKey: ['up3s'], queryFn: () => apiService.get<Up3[]>('/up3s') });
    const { data: gardusData } = useQuery({ queryKey: ['gardus'], queryFn: () => apiService.get<Gardu[]>('/gardus') });
    const users = usersData?.data ?? [];
    const up3s = up3sData?.data ?? [];
    const gardus = gardusData?.data ?? [];

    const saveMutation = useMutation({
        mutationFn: (formData: Partial<Notifikasi>) => {
            const today = new Date().toISOString().split('T')[0];

            const payload = {
                ...formData,
                pembuat_id: editData ? Number(formData.pembuat_id) : currentUser?.id,
                up3_id: Number(formData.up3_id),
                gardu_id: Number(formData.gardu_id),
                lat: formData.lat ? Number(formData.lat) : null,
                lng: formData.lng ? Number(formData.lng) : null,
                tanggal: formData.tanggal || today,
            };

            if (!payload.up3_id || !payload.gardu_id || !payload.status || !payload.keterangan) {
                alert("Pastikan semua field yang wajib diisi telah terisi (UP3, Gardu, Keterangan, Status).");
                return Promise.reject(new Error("Validasi gagal di sisi klien."));
            }

            if (editData) {
                return apiService.put(`/notifikasis/${editData.id}`, payload);
            }
            return apiService.post('/notifikasis', payload);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['notifikasis'] });
            setEditData(null);
        },
        onError: (error: any) => {
            if (error.message === "Validasi gagal di sisi klien.") {
                return;
            }
            alert(`Gagal menyimpan notifikasi: ${error.response?.data?.message || error.message}`);
        }
    });

    const deleteMutation = useMutation({
        mutationFn: (id: number) => apiService.delete(`/notifikasis/${id}`),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['notifikasis'] });
        },
        onError: (error: any) => {
            alert(`Gagal menghapus notifikasi: ${error.response?.data?.message || error.message}`);
        }
    });

    const handleDelete = (id: number) => {
        if (window.confirm("Anda yakin ingin menghapus notifikasi ini?")) {
            deleteMutation.mutate(id);
        }
    };

    const editFields: Field[] = useMemo(() => [
        { id: "pembuat_id", label: "Pembuat", type: "select", options: users.map(u => ({ id: u.id, label: u.nama })) },
        { id: "up3_id", label: "UP3", type: "select", options: up3s.map(u => ({ id: u.id, label: u.nama_up3 })) },
        { id: "gardu_id", label: "Gardu", type: "select", options: gardus.map(g => ({ id: g.id, label: g.nama_gardu })) },
        { id: "keterangan", label: "Keterangan", placeholder: "Masukkan keterangan notifikasi", type: "text" },
        { id: "status", label: "Status", type: "select", options: [{ id: 'open', label: 'Open' }, { id: 'closed', label: 'Closed' }, { id: 'pending', label: 'Pending' }] },
        { id: "tanggal", label: "Tanggal", placeholder: "YYYY-MM-DD", type: "text" },
        { id: "lat", label: "Latitude", placeholder: "Contoh: -6.200000", type: "text" },
        { id: "lng", label: "Longitude", placeholder: "Contoh: 106.816666", type: "text" },
    ], [users, up3s, gardus]);

    const addFields = useMemo(() => editFields.filter(field => field.id !== 'pembuat_id'), [editFields]);

    const columns: ColumnDef<Notifikasi>[] = useMemo(() => [
        { id: "no", header: "No", cell: ({ row }) => row.index + 1 },
        { accessorKey: "pembuat.nama", header: "Pembuat" },
        { accessorKey: "up3.nama_up3", header: "UP3" },
        { accessorKey: "gardu.nama_gardu", header: "Gardu" },
        { accessorKey: "keterangan", header: "Keterangan" },
        { accessorKey: "status", header: "Status", cell: ({ row }) => <StatusBadge status={row.getValue("status")} /> },
        { accessorKey: "tanggal", header: "Tanggal" },
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
    ], []);

    return (
        <SidebarProvider className="font-poppins">
            {/* <AppSidebar className="w-[200px]" /> */}
            <SidebarInset className="bg-white">
                {/* <Header /> */}
                <div>
                    <div className="bg-white border border-[#E5E5E5] shadow-sm rounded-lg p-4 mx-5 my-5">
                        <div className="flex justify-between items-center">
                            <p className="font-semibold text-xl">Manajemen Notifikasi</p>
                            <DialogDemo
                                button="Tambah Notifikasi"
                                icon={BellRing}
                                title="Tambah Notifikasi Baru"
                                fields={addFields}
                                onSubmit={(formData) => saveMutation.mutate(formData)}
                            />
                        </div>
                        <div className="mt-5">
                            {isLoading ? <p>Memuat data...</p> : isError ? <p className="text-red-500">Gagal memuat data.</p> : <DataTable columns={columns} data={notifikasis} />}
                        </div>
                    </div>
                </div>
                {editData && (
                    <DialogDemo
                        open={!!editData}
                        onOpenChange={(open) => !open && setEditData(null)}
                        title="Edit Notifikasi"
                        fields={editFields}
                        initialData={editData}
                        onSubmit={(formData) => saveMutation.mutate(formData)}
                    />
                )}
            </SidebarInset>
        </SidebarProvider>
    );
}
