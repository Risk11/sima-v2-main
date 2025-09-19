import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import { Delete, Edit } from "lucide-react";
import type { Field } from "@/components/sheet-demo";

import apiService from "@/services/api-services";

import { AppSidebar } from "@/components/app-sidebar";
import SheetDemo from "@/components/sheet-demo";
import { DataTable } from "@/components/data-table";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import Header from "../dashboard/header";

export type ULP = { id: number; nama_ulp: string };
export type User = {
  id: number;
  username: string;
  nama: string;
  /* email?: string; */
  status: "aktif" | "nonaktif" | "pending" | "selesai" | "diproses";
  ulp_id: number;
  ulp: ULP | null;
  img?: string | null;
};

export default function MasterAkun() {
  const queryClient = useQueryClient();
  const [editUser, setEditUser] = useState<User | null>(null);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);

  const { data: usersData, isLoading: isLoadingUsers, isError: isErrorUsers } = useQuery({
    queryKey: ['users'],
    queryFn: () => apiService.get<User[]>('/users'),
  });
  const users = usersData?.data ?? [];

  const { data: ulpsData } = useQuery({
    queryKey: ['ulps'],
    queryFn: () => apiService.get<ULP[]>('/ulps'),
  });
  const ulps = ulpsData?.data ?? [];

  const saveUserMutation = useMutation({
    mutationFn: (formData: FormData) => {
      if (editUser) {
        formData.append('_method', 'PUT');
        return apiService.post(`/users/${editUser.id}`, formData);
      }
      return apiService.post('/users', formData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      setEditUser(null);
      return { success: true };
    },
    onError: (error: any) => {
      alert(`Gagal menyimpan pengguna: ${error.response?.data?.message || error.message}`);
      return { success: false };
    }
  });

  const deleteUserMutation = useMutation({
    mutationFn: (id: number) => apiService.delete(`/users/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      setUserToDelete(null);
    },
    onError: (error: any) => {
      alert(`Gagal menghapus pengguna: ${error.response?.data?.message || error.message}`);
    }
  });

  const handleDelete = () => {
    if (userToDelete) {
      deleteUserMutation.mutate(userToDelete.id);
    }
  };

  const handleFormSubmit = (formData: Record<string, any>) => {
    const payload = new FormData();
    for (const key in formData) {
      const value = formData[key];
      if (key === "img" && value instanceof FileList && value.length > 0) {
        payload.append(key, value[0]);
      } else if (value !== undefined && value !== null && value !== "") {
        payload.append(key, String(value));
      }
    }
    return saveUserMutation.mutateAsync(payload);
  };

  const fields: Field[] = [
    { id: "username", label: "Username", placeholder: "Masukan Username", required: true },
    { id: "password", label: "Password", type: "password", placeholder: "Kosongkan jika tidak ingin diubah", optional: !!editUser, required: !editUser },
    { id: "nama", label: "Nama Lengkap", placeholder: "Masukan Nama Lengkap", required: true },
    /* { id: "email", label: "Email", placeholder: "Masukan Email", type: "email", required: true }, */
    { id: "status", label: "Status", type: "select", options: [{ id: "aktif", label: "Aktif" }, { id: "nonaktif", label: "Nonaktif" }], required: true },
    { id: "img", label: "Foto Profil", type: "file", optional: true },
    { id: "ulp_id", label: "Pilih ULP", type: "select", options: ulps.map((u) => ({ id: u.id, label: u.nama_ulp })), required: true },
  ];

  const columns: ColumnDef<User>[] = [
    { id: "no", header: "No", cell: ({ row }) => row.index + 1 },
    { accessorKey: "nama", header: "Nama" },
    { accessorKey: "ulp.nama_ulp", header: "ULP", cell: ({ row }) => row.original.ulp?.nama_ulp ?? "-" },
    { accessorKey: "status", header: "Status", cell: ({ row }) => <div className="capitalize">{row.getValue("status")}</div> },
    {
      id: "aksi", header: "Aksi", cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <button onClick={() => setEditUser(row.original)} className="hover:bg-slate-200 hover:text-black bg-[#106A82] p-1 rounded-md text-white transition" title="Edit User">
            <Edit className="w-5 h-5" />
          </button>
          <button onClick={() => setUserToDelete(row.original)} className="hover:bg-slate-200 hover:text-black bg-red-500 p-1 rounded-md text-white transition" title="Hapus User">
            <Delete className="w-5 h-5" />
          </button>
        </div>
      )
    },
  ];

  return (
    <SidebarProvider className="font-poppins">
      <AppSidebar className="w-[200px]" />
      <SidebarInset className="bg-gradient-to-b from-[#FCFCFC] to-[#D9E3EA]">
        <Header />
        <div>
          <div className="bg-white border border-[#E5E5E5] shadow-sm rounded-lg p-4 mx-5 my-5">
            <div className="flex justify-between items-center">
              <p className="font-semibold">Daftar Akun</p>
              <SheetDemo
                button="Tambah User"
                title="Tambah User"
                fields={fields}
                onSubmit={handleFormSubmit}
              />
            </div>
            <div className="mt-5">
              {isLoadingUsers ? <p>Memuat data...</p> : isErrorUsers ? <p className="text-red-500">Gagal memuat data.</p> : <DataTable columns={columns} data={users} />}
            </div>
          </div>
        </div>
        {editUser && (
          <SheetDemo
            open={!!editUser}
            onOpenChange={(open) => !open && setEditUser(null)}
            button="Simpan"
            title="Edit User"
            fields={fields}
            initialData={editUser}
            onSubmit={handleFormSubmit}
          />
        )}
        {userToDelete && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl">
              <h3 className="text-lg font-semibold mb-4">Konfirmasi Hapus</h3>
              <p>Anda yakin ingin menghapus pengguna "{userToDelete.nama}"?</p>
              <div className="flex justify-end gap-4 mt-6">
                <button onClick={() => setUserToDelete(null)} className="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300">Batal</button>
                <button onClick={handleDelete} className="px-4 py-2 rounded-md bg-red-500 text-white hover:bg-red-600">Ya, Hapus</button>
              </div>
            </div>
          </div>
        )}
      </SidebarInset>
    </SidebarProvider>
  );
}
