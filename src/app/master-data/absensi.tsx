import { useState, useMemo, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import { Delete, Edit, MapPin } from "lucide-react";
import type { Field } from "@/components/dialog";

import apiService from "@/services/api-services";

import { AppSidebar } from "@/components/app-sidebar";
import DialogDemo from "@/components/dialog";
import { DataTable } from "@/components/data-table";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import Header from "../dashboard/header";

export type Absensi = {
    id: number;
    user_id: number;
    waktu: string;
    lokasi: string;
    lat?: number | null;
    lng?: number | null;
    status: string;
    tipe_absen: string;
    tgl: string;
    user?: { id: number; nama: string };
};
export type User = { id: number; nama: string };

export default function AbsensiPage() {
    const queryClient = useQueryClient();
    const [editData, setEditData] = useState<Absensi | null>(null);
    const [isAddDialogOpen, setAddDialogOpen] = useState(false);
    const [initialDialogData, setInitialDialogData] = useState<Partial<Absensi>>({});
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

    const { data: absensisData, isLoading, isError } = useQuery({
        queryKey: ['absensis'],
        queryFn: () => apiService.get<Absensi[]>('/absensis'),
    });
    const absensis = absensisData?.data ?? [];

    const { data: usersData } = useQuery({
        queryKey: ['users'],
        queryFn: () => apiService.get<User[]>('/users'),
    });
    const users = usersData?.data ?? [];

    const saveAbsensiMutation = useMutation({
        mutationFn: (formData: Partial<Absensi>) => {
            const payload = {
                ...formData,
                user_id: editData ? Number(formData.user_id) : currentUser?.id,
                lat: formData.lat ? Number(formData.lat) : null,
                lng: formData.lng ? Number(formData.lng) : null,
            };
            if (editData) {
                return apiService.put(`/absensis/${editData.id}`, payload);
            }
            return apiService.post('/absensis', payload);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['absensis'] });
            setEditData(null);
            setAddDialogOpen(false);
        },
        onError: (error: any) => {
            alert(`Gagal menyimpan data: ${error.response?.data?.message || error.message}`);
        }
    });

    const deleteAbsensiMutation = useMutation({
        mutationFn: (id: number) => apiService.delete(`/absensis/${id}`),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['absensis'] });
        },
        onError: (error: any) => {
            alert(`Gagal menghapus data: ${error.response?.data?.message || error.message}`);
        }
    });

    const handleDelete = (id: number) => {
        if (window.confirm("Yakin ingin menghapus data absensi ini?")) {
            deleteAbsensiMutation.mutate(id);
        }
    };

    const handleOpenDialogWithCurrentData = () => {
        const now = new Date();
        const pad = (num: number) => num.toString().padStart(2, '0');
        const tgl = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
        const waktu = `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;

        setInitialDialogData({ tgl, waktu, lokasi: "Mendeteksi lokasi...", status: 'hadir', tipe_absen: 'masuk' });
        setAddDialogOpen(true);

        navigator.geolocation?.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;
                try {
                    const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
                    const data = await response.json();
                    const lokasi = data.display_name || 'Lokasi tidak terdeteksi';
                    setInitialDialogData((prev) => ({ ...prev, lokasi, lat: latitude, lng: longitude }));
                } catch {
                    setInitialDialogData((prev) => ({ ...prev, lokasi: 'Gagal mendapatkan nama lokasi', lat: latitude, lng: longitude }));
                }
            },
            () => {
                alert('Gagal mendapatkan lokasi. Pastikan izin lokasi telah diberikan.');
                setInitialDialogData((prev) => ({ ...prev, lokasi: 'Izin lokasi ditolak' }));
            }
        );
    };

    const editFields: Field[] = useMemo(() => [
        { id: "user_id", label: "User", type: "select", options: users.map((u) => ({ id: u.id, label: u.nama })) },
        { id: "tgl", label: "Tanggal", type: "text", placeholder: "YYYY-MM-DD" },
        { id: "waktu", label: "Waktu", type: "text", placeholder: "HH:MM:SS" },
        { id: "status", label: "Status", type: "select", options: [{ id: 'hadir', label: 'Hadir' }, { id: 'izin', label: 'Izin' }, { id: 'sakit', label: 'Sakit' }] },
        { id: "tipe_absen", label: "Tipe Absen", type: "select", options: [{ id: 'masuk', label: 'Masuk' }, { id: 'pulang', label: 'Pulang' }] },
        { id: "lokasi", label: "Lokasi", placeholder: "Masukan lokasi", type: "text" },
        { id: "lat", label: "Latitude", placeholder: "Akan terisi otomatis", type: "text" },
        { id: "lng", label: "Longitude", placeholder: "Akan terisi otomatis", type: "text" },
    ], [users]);

    const addFields = useMemo(() => editFields.filter(field => field.id !== 'user_id'), [editFields]);

    const columns: ColumnDef<Absensi>[] = useMemo(() => [
        { id: "no", header: "No", cell: ({ row }) => row.index + 1 },
        { accessorKey: "user.nama", header: "Nama User" },
        { accessorKey: "tgl", header: "Tanggal" },
        { accessorKey: "waktu", header: "Waktu" },
        { accessorKey: "status", header: "Status", cell: ({ row }) => <div className="capitalize">{row.getValue("status")}</div> },
        { accessorKey: "tipe_absen", header: "Tipe Absen", cell: ({ row }) => <div className="capitalize">{row.getValue("tipe_absen")}</div> },
        { accessorKey: "lokasi", header: "Lokasi" },
        {
            id: "aksi", header: "Aksi",
            cell: ({ row }) => (
                <div className="flex items-center gap-2">
                    <button onClick={() => setEditData(row.original)} className="hover:bg-slate-200 hover:text-black bg-[#106A82] p-1 rounded-md text-white" title="Edit Data"><Edit className="w-5 h-5" /></button>
                    <button onClick={() => handleDelete(row.original.id)} className="hover:bg-slate-200 hover:text-black bg-red-500 p-1 rounded-md text-white" title="Hapus Data"><Delete className="w-5 h-5" /></button>
                </div>
            ),
        },
    ], []);

    return (
        <SidebarProvider className="font-poppins">
            <AppSidebar className="w-[200px]" />
            <SidebarInset className="bg-white">
                <Header />
                <div>
                    <div className="bg-white border border-[#E5E5E5] shadow-sm rounded-lg p-4 mx-5 my-5">
                        <div className="flex justify-between items-center">
                            <p className="font-semibold">Daftar Absensi</p>
                            <div className="flex items-center gap-2">
                                <button onClick={handleOpenDialogWithCurrentData} className="flex items-center gap-2 bg-blue-600 text-white px-3 py-2 rounded-md hover:bg-blue-700 transition-colors">
                                    <MapPin className="w-5 h-5" />
                                    <span>Isi Absensi Sekarang</span>
                                </button>
                                <DialogDemo
                                    button="Tambah Manual"
                                    title="Tambah Absensi Manual"
                                    fields={addFields}
                                    onSubmit={(formData) => saveAbsensiMutation.mutate(formData)}
                                />
                            </div>
                        </div>
                        <div className="mt-5">
                            {isLoading ? <p>Memuat data...</p> : isError ? <p className="text-red-500">Gagal memuat data.</p> : <DataTable columns={columns} data={absensis} />}
                        </div>
                    </div>
                </div>

                <DialogDemo
                    open={isAddDialogOpen}
                    onOpenChange={setAddDialogOpen}
                    title="Tambah Absensi"
                    fields={addFields} // 
                    initialData={initialDialogData}
                    onSubmit={(formData) => saveAbsensiMutation.mutate(formData)}
                />

                {editData && (
                    <DialogDemo
                        open={!!editData}
                        onOpenChange={(open) => !open && setEditData(null)}
                        title="Edit Absensi"
                        fields={editFields}
                        initialData={editData}
                        onSubmit={(formData) => saveAbsensiMutation.mutate(formData)}
                    />
                )}
            </SidebarInset>
        </SidebarProvider>
    );
}
