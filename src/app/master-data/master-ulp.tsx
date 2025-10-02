import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import { Delete, Edit } from "lucide-react";
import type { Field } from "@/components/dialog";

import apiService from "@/services/api-services";

/* import { AppSidebar } from "@/components/app-sidebar"; */
import DialogDemo from "@/components/dialog";
import { DataTable } from "@/components/data-table";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
/* import Header from "../dashboard/header"; */

export type UP3 = { id: number; nama_up3: string };
export type ULP = {
  id: number;
  up3?: UP3 | null;
  up3_id: number;
  nama_ulp: string;
  alias: string;
};

type UlpFormData = Omit<ULP, 'id' | 'up3'>;

export default function MasterULP() {
  const queryClient = useQueryClient();
  const [editData, setEditData] = useState<ULP | null>(null);

  const { data: ulpsData, isLoading: isLoadingUlps, isError: isErrorUlps } = useQuery({
    queryKey: ['ulps'],
    queryFn: () => apiService.get<ULP[]>('/ulps'),
  });
  const ulps = ulpsData?.data ?? [];

  const { data: up3sData } = useQuery({
    queryKey: ['up3s'],
    queryFn: () => apiService.get<UP3[]>('/up3s'),
  });
  const up3Options = up3sData?.data ?? [];

  const saveUlpMutation = useMutation({
    mutationFn: (formData: UlpFormData) => {
      const payload = { ...formData, up3_id: Number(formData.up3_id) };
      if (editData) {
        return apiService.put(`/ulps/${editData.id}`, payload);
      }
      return apiService.post('/ulps', payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ulps'] });
      setEditData(null);
    },
    onError: (error: any) => {
      alert(`Gagal menyimpan data: ${error.response?.data?.message || error.message}`);
    }
  });

  const deleteUlpMutation = useMutation({
    mutationFn: (id: number) => apiService.delete(`/ulps/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ulps'] });
    },
    onError: (error: any) => {
      alert(`Gagal menghapus data: ${error.response?.data?.message || error.message}`);
    }
  });

  const handleDelete = (id: number) => {
    if (window.confirm("Yakin hapus data ini?")) {
      deleteUlpMutation.mutate(id);
    }
  };

  const fields: Field[] = [
    { id: "up3_id", label: "Pilih UP3", type: "select", options: up3Options.map(u => ({ id: u.id, label: u.nama_up3 })) },
    { id: "nama_ulp", label: "Nama ULP", placeholder: "Masukan Nama ULP", type: "text" },
    { id: "alias", label: "Alias", placeholder: "Masukan Alias", type: "text" }
  ];

  const columns: ColumnDef<ULP>[] = [
    { id: 'no', header: 'No', cell: ({ row }) => row.index + 1 },
    { accessorKey: 'up3.nama_up3', header: 'UP3', cell: ({ row }) => row.original.up3?.nama_up3 || '-' },
    { accessorKey: 'nama_ulp', header: 'ULP' },
    { accessorKey: 'alias', header: 'Alias' },
    {
      id: 'aksi', header: 'Aksi', cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <button onClick={() => setEditData(row.original)} className="hover:bg-slate-200 hover:text-black bg-[#106A82] p-1 rounded-md text-white flex items-center" title="Edit ULP">
            <Edit className="w-5 h-5" />
          </button>
          <button onClick={() => handleDelete(row.original.id)} className="hover:bg-slate-200 hover:text-black bg-[#EA3A3A] p-1 rounded-md text-white" title="Hapus ULP">
            <Delete className="w-5 h-5" />
          </button>
        </div>
      )
    },
  ];

  return (
    <SidebarProvider className="font-poppins">
      {/* <AppSidebar className="w-[200px]" /> */}
      <SidebarInset className="bg-white">
        {/* <Header /> */}
        <div>
          <div className="bg-white border border-[#E5E5E5] shadow-sm rounded-lg p-4 mx-5 my-5">
            <div className="flex justify-between items-center">
              <p className="font-semibold">Daftar ULP</p>
              <DialogDemo
                button='Tambah ULP'
                title='Tambah ULP'
                fields={fields}
                onSubmit={(formData) => saveUlpMutation.mutate(formData as UlpFormData)}
              />
            </div>
            <div className="mt-5">
              {isLoadingUlps ? <p>Loading...</p> : isErrorUlps ? <p className="text-red-500">Gagal memuat data.</p> : <DataTable columns={columns} data={ulps} />}
            </div>
          </div>
        </div>
        {editData && (
          <DialogDemo
            open={!!editData}
            onOpenChange={(open) => !open && setEditData(null)}
            title="Edit ULP"
            fields={fields}
            initialData={editData}
            onSubmit={(formData) => saveUlpMutation.mutate(formData as UlpFormData)}
            button="Simpan"
          />
        )}
      </SidebarInset>
    </SidebarProvider>
  );
}
