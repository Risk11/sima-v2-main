import { AppSidebar } from '@/components/app-sidebar';
import DialogDemo from '@/components/dialog';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { ColumnDef } from '@tanstack/react-table';
import { Delete, Edit, Plus, AlertCircle } from 'lucide-react';
import Header from '../dashboard/header';
import { DataTable } from '@/components/data-table';
import React, { useState, useEffect, useCallback } from 'react';

// --- Tipe Data ---
// Tipe Data untuk Tampilan Tabel
export type Gardu = {
    id: number;
    nama: string;
    ulp: string;
    up3: string;
    penyulang: string;
};

// Tipe Data untuk Form Input
type Field = {
    id: string;
    label: string;
    placeholder: string;
    defaultValue?: string;
};

// --- Komponen UI Tambahan ---

// Komponen untuk Indikator Loading
const LoadingSpinner = () => (
    <div className="flex flex-col items-center justify-center gap-4 p-8 text-gray-500">
        <svg className="animate-spin h-8 w-8 text-[#106A82]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p>Memuat data gardu...</p>
    </div>
);

// Komponen untuk Pesan Error
const ErrorDisplay = ({ message }: { message: string }) => (
    <div className="flex flex-col items-center justify-center gap-4 p-8 text-red-600 bg-red-50 rounded-lg">
        <AlertCircle className="w-10 h-10" />
        <p className="font-semibold">Terjadi Kesalahan</p>
        <p className="text-sm text-center">{message}</p>
    </div>
);


// --- Fungsi Helper untuk Panggilan API ---
// Menggunakan Laravel Sanctum untuk otentikasi.
const authenticatedFetch = async (url: string, options: RequestInit = {}) => {
    // Pastikan cookie CSRF selalu fresh sebelum request non-GET
    if (options.method && options.method !== 'GET') {
        await fetch('/sanctum/csrf-cookie', { credentials: 'include' });
    }

    const defaultOptions: RequestInit = {
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            ...options.headers,
        },
    };

    const finalOptions = { ...defaultOptions, ...options };
    const response = await fetch(url, finalOptions);

    if (response.status === 401) {
        window.location.href = '/login'; // Arahkan ke login jika sesi habis
        throw new Error('Sesi Anda telah berakhir. Silakan login kembali.');
    }

    return response;
};


// --- Komponen Utama: MasterGardu ---
export default function MasterGardu() {
    // --- State Management ---
    const [data, setData] = useState<Gardu[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [editingGardu, setEditingGardu] = useState<Gardu | null>(null);
    const [garduToDelete, setGarduToDelete] = useState<Gardu | null>(null);

    // --- CRUD Operations ---

    // 1. READ: Mengambil data dari API
    const fetchGardus = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await authenticatedFetch('/api/gardus');
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || 'Gagal mengambil data gardu.');
            }
            const result = await response.json();
            // Mapping data dari API ke format yang sesuai dengan tipe `Gardu`
            const mappedData = result.data.data.map((gardu: any) => ({
                id: gardu.id,
                nama: gardu.nama_gardu || 'N/A',
                ulp: gardu.ulp?.nama || 'N/A',
                up3: gardu.ulp?.up3?.nama || 'N/A',
                penyulang: gardu.penyulang || 'N/A',
            }));
            setData(mappedData);
        } catch (e: any) {
            setError(e.message);
            console.error('Error fetching gardus:', e);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchGardus();
    }, [fetchGardus]);

    // 2. CREATE: Menambah data baru
    const handleAddGardu = async (formData: Record<string, string>): Promise<void> => {
        try {
            const payload = {
                nama_gardu: formData.namaGardu,
                penyulang: formData.penyulang,
                ulp_id: 1, // TODO: Ganti dengan ID dinamis dari dropdown
                ratio_id: 1, // TODO: Ganti dengan ID dinamis dari dropdown
            };
            const response = await authenticatedFetch('/api/gardus', {
                method: 'POST',
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || 'Gagal menambah gardu.');
            }
            // Refresh data setelah berhasil untuk menampilkan data baru
            await fetchGardus();
        } catch (error: any) {
            console.error('Error adding gardu:', error);
            // Menampilkan error ke pengguna bisa dilakukan di dalam dialog
            // atau menggunakan sistem notifikasi (toast)
            alert('Error: ' + error.message); // Sementara tetap pakai alert untuk error
        }
    };

    // 3. UPDATE: Memperbarui data yang ada
    const handleUpdateGardu = async (formData: Record<string, string>, id: number): Promise<void> => {
        try {
            const payload = {
                nama_gardu: formData.namaGardu,
                penyulang: formData.penyulang,
                ulp_id: 1, // TODO: Ganti dengan ID dinamis
                ratio_id: 1, // TODO: Ganti dengan ID dinamis
            };
            const response = await authenticatedFetch(`/api/gardus/${id}`, {
                method: 'PUT',
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || 'Gagal memperbarui gardu.');
            }
            // Refresh data setelah berhasil
            await fetchGardus();
        } catch (error: any) {
            console.error('Error updating gardu:', error);
            alert('Error: ' + error.message); // Sementara tetap pakai alert untuk error
        }
    };

    // 4. DELETE: Menghapus data
    const handleDeleteGardu = async (id: number) => {
        try {
            const response = await authenticatedFetch(`/api/gardus/${id}`, { method: 'DELETE' });
            if (!response.ok) {
                throw new Error('Gagal menghapus data.');
            }
            // Update UI secara optimis atau fetch ulang
            setData(prevData => prevData.filter(item => item.id !== id));
        } catch (e: any) {
            console.error('Error deleting gardu:', e);
            alert('Error: ' + e.message); // Sementara tetap pakai alert untuk error
        } finally {
            // Tutup dialog konfirmasi setelah selesai
            setGarduToDelete(null);
        }
    };

    // --- Fungsi Bantuan untuk Dialog ---
    const openEditDialog = (gardu: Gardu) => setEditingGardu(gardu);
    const closeEditDialog = () => setEditingGardu(null);
    const openDeleteConfirm = (gardu: Gardu) => setGarduToDelete(gardu);
    const closeDeleteConfirm = () => setGarduToDelete(null);


    // --- Konfigurasi Tabel dan Form ---
    const columns: ColumnDef<Gardu>[] = [
        { id: 'no', header: 'No', cell: ({ row }) => row.index + 1, size: 50 },
        {
            id: 'aksi',
            header: 'Aksi',
            cell: ({ row }) => (
                <div className="flex items-center gap-2">
                    {/* Tombol Edit dengan style yang lebih baik */}
                    <button
                        onClick={() => openEditDialog(row.original)}
                        className="p-2 text-blue-600 bg-blue-100 rounded-lg hover:bg-blue-200 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                        aria-label="Edit Gardu"
                    >
                        <Edit className="w-4 h-4" />
                    </button>
                    {/* Tombol Delete dengan style yang lebih baik */}
                    <button
                        onClick={() => openDeleteConfirm(row.original)}
                        className="p-2 text-red-600 bg-red-100 rounded-lg hover:bg-red-200 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
                        aria-label="Hapus Gardu"
                    >
                        <Delete className="w-4 h-4" />
                    </button>
                </div>
            ),
            size: 100,
        },
        { accessorKey: 'nama', header: 'Nama Gardu' },
        { accessorKey: 'up3', header: 'UP3' },
        { accessorKey: 'ulp', header: 'ULP' },
        { accessorKey: 'penyulang', header: 'Penyulang' },
    ];

    const fields: Field[] = [
        { id: 'namaGardu', label: 'Nama Gardu', placeholder: 'Masukan Nama Gardu' },
        { id: 'penyulang', label: 'Penyulang', placeholder: 'Masukan Nama Penyulang' },
        // TODO: Tambahkan field untuk dropdown ULP dan Ratio di sini
    ];

    // --- Tampilan Komponen (JSX) ---
    return (
        <SidebarProvider className="font-poppins">
            <AppSidebar className="w-[200px]" />
            <SidebarInset className="bg-gradient-to-b from-[#F7F8FA] to-[#E9EFF3] min-h-screen">
                <Header />
                <main className="p-5">
                    {/* Card utama untuk konten */}
                    <div className="bg-white border border-gray-200/75 shadow-sm rounded-xl">
                        <div className="flex justify-between items-center p-4 border-b border-gray-200/75">
                            <p className="font-semibold text-lg text-gray-800">Manajemen Data Gardu</p>
                            {/* Dialog untuk Tambah Gardu dengan Tombol yang lebih menarik */}
                            <DialogDemo
                                trigger={
                                    <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[#106A82] rounded-lg hover:bg-[#0d5a6e] transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#106A82]">
                                        <Plus className="w-4 h-4" />
                                        <span>Tambah Gardu</span>
                                    </button>
                                }
                                title="Tambah Gardu Baru"
                                fields={fields}
                                onSubmit={handleAddGardu}
                            />
                        </div>

                        {/* Konten Tabel */}
                        <div className="p-4">
                            {loading && <LoadingSpinner />}
                            {error && <ErrorDisplay message={error} />}
                            {!loading && !error && <DataTable columns={columns} data={data} />}
                        </div>
                    </div>
                </main>

                {/* Dialog untuk Edit Gardu */}
                {editingGardu && (
                    <DialogDemo
                        key={editingGardu.id}
                        title="Edit Data Gardu"
                        fields={fields.map(f => ({
                            ...f,
                            defaultValue:
                                f.id === 'namaGardu'
                                    ? editingGardu.nama
                                    : f.id === 'penyulang'
                                        ? editingGardu.penyulang
                                        : '',
                        }))}
                        onSubmit={async (formData) => {
                            await handleUpdateGardu(formData, editingGardu.id);
                            closeEditDialog();
                        }}
                        onClose={closeEditDialog}
                        open={true}
                    />
                )}

                {/* Dialog Konfirmasi Hapus */}
                {garduToDelete && (
                    <DialogDemo
                        open={!!garduToDelete}
                        onClose={closeDeleteConfirm}
                        title="Konfirmasi Hapus"
                        description={`Apakah Anda yakin ingin menghapus gardu "${garduToDelete.nama}"? Tindakan ini tidak dapat dibatalkan.`}
                        isConfirmation={true}
                        onConfirm={() => handleDeleteGardu(garduToDelete.id)}
                    />
                )}

            </SidebarInset>
        </SidebarProvider>
    );
}
