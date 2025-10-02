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

export type UP3 = {
  id: number;
  nama_up3: string;
};

type Up3FormData = Omit<UP3, 'id'>;

export default function MasterUP3() {
  const queryClient = useQueryClient();
  const [editData, setEditData] = useState<UP3 | null>(null);

  const { data: up3sData, isLoading, isError } = useQuery({
    queryKey: ['up3s'],
    queryFn: () => apiService.get<UP3[]>('/up3s'),
  });
  const up3s = up3sData?.data ?? [];

  const saveUp3Mutation = useMutation({
    mutationFn: (formData: Up3FormData) => {
      if (editData) {
        return apiService.put(`/up3s/${editData.id}`, formData);
      }
      return apiService.post('/up3s', formData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['up3s'] });
      setEditData(null);
    },
    onError: (error: any) => {
      alert(`Gagal menyimpan data: ${error.response?.data?.message || error.message}`);
    }
  });

  const deleteUp3Mutation = useMutation({
    mutationFn: (id: number) => apiService.delete(`/up3s/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['up3s'] });
    },
    onError: (error: any) => {
      alert(`Gagal menghapus data: ${error.response?.data?.message || error.message}`);
    }
  });

  const handleDelete = (id: number) => {
    if (window.confirm("Yakin ingin menghapus data ini?")) {
      deleteUp3Mutation.mutate(id);
    }
  };

  const fields: Field[] = [
    { id: "nama_up3", label: "Nama UP3", placeholder: "Masukan Nama UP3" },
  ];

  const columns: ColumnDef<UP3>[] = [
    { id: "no", header: "No", cell: ({ row }) => row.index + 1 },
    { accessorKey: "nama_up3", header: "UP3" },
    {
      id: "aksi", header: "Aksi", cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <button onClick={() => setEditData(row.original)} className="hover:bg-slate-200 hover:text-black bg-[#106A82] p-1 rounded-md text-white">
            <Edit className="w-5 h-5" />
          </button>
          <button onClick={() => handleDelete(row.original.id)} className="hover:bg-slate-200 hover:text-black bg-[#EA3A3A] p-1 rounded-md text-white">
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
              <p className="font-semibold">Daftar UP3</p>
              <DialogDemo
                button="Tambah UP3"
                title="Tambah UP3"
                fields={fields}
                onSubmit={(formData) => saveUp3Mutation.mutate(formData as Up3FormData)}
              />
            </div>
            <div className="mt-5">
              {isLoading ? <p>Loading...</p> : isError ? <p className="text-red-500">Gagal memuat data.</p> : <DataTable columns={columns} data={up3s} />}
            </div>
          </div>
        </div>
        {editData && (
          <DialogDemo
            open={!!editData}
            onOpenChange={(open) => !open && setEditData(null)}
            title="Edit UP3"
            fields={fields}
            initialData={editData}
            onSubmit={(formData) => saveUp3Mutation.mutate(formData as Up3FormData)}
            button="Simpan"
          />
        )}
      </SidebarInset>
    </SidebarProvider>
  );
}
