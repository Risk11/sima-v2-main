import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import { Delete, Pencil } from "lucide-react";

import apiService from "@/services/api-services";

import { AppSidebar } from "@/components/app-sidebar";
import DialogDemo from "@/components/dialog";
import { DataTable } from "@/components/data-table";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import Header from "../dashboard/header";

export type KWH = {
  id: number;
  merk_kwh: string;
};

type KwhFormData = {
  merk_kwh: string;
};

export default function MasterKWH() {
  const queryClient = useQueryClient();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentKwh, setCurrentKwh] = useState<KWH | null>(null);

  const { data: kwhData, isLoading } = useQuery({
    queryKey: ['kwhs'],
    queryFn: () => apiService.get<KWH[]>('/kwhs'),
  });
  const kwhs = kwhData?.data ?? [];

  const addKwhMutation = useMutation({
    mutationFn: (newKwh: KwhFormData) => apiService.post('/kwhs', newKwh),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['kwhs'] });
    },
  });

  const updateKwhMutation = useMutation({
    mutationFn: (updatedKwh: KwhFormData) => apiService.put(`/kwhs/${currentKwh!.id}`, updatedKwh),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['kwhs'] });
      setIsEditDialogOpen(false);
    },
  });

  const deleteKwhMutation = useMutation({
    mutationFn: (id: number) => apiService.delete(`/kwhs/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['kwhs'] });
    },
  });

  const handleDelete = (id: number) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus merk ini?")) {
      deleteKwhMutation.mutate(id);
    }
  };

  const openEditDialog = (kwh: KWH) => {
    setCurrentKwh(kwh);
    setIsEditDialogOpen(true);
  };

  const columns: ColumnDef<KWH>[] = [
    { id: "no", header: "No", cell: ({ row }) => row.index + 1 },
    {
      accessorKey: "merk_kwh",
      header: "Merk KWH",
      cell: ({ row }) => <div className="capitalize">{row.getValue("merk_kwh")}</div>,
    },
    {
      id: "aksi", header: "Aksi", cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => openEditDialog(row.original)}
            className="hover:bg-slate-200 hover:text-black bg-[#106A82] p-1 rounded-md text-white flex items-center"
          >
            <Pencil className="w-5 h-5" />
          </button>
          <button
            onClick={() => handleDelete(row.original.id)}
            className="hover:bg-slate-200 hover:text-black bg-[#EA3A3A] p-1 rounded-md text-white transition-colors"
          >
            <Delete className="w-5 h-5" />
          </button>
        </div>
      )
    },
  ];

  const fields = [
    {
      id: "merk_kwh",
      label: "Merk KWH",
      placeholder: "Masukan Merk KWH",
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
              <p className="font-semibold">Daftar KWH</p>
              <DialogDemo<KwhFormData>
                button="Tambah KWH"
                title="Tambah KWH"
                fields={fields}
                onSubmit={(formData) => addKwhMutation.mutate(formData)}
              />
            </div>
            <div className="mt-5">
              {isLoading ? (
                <p>Memuat data...</p>
              ) : (
                <DataTable columns={columns} data={kwhs} />
              )}
            </div>
          </div>
        </div>

        {currentKwh && (
          <DialogDemo<KwhFormData>
            open={isEditDialogOpen}
            onOpenChange={setIsEditDialogOpen}
            title="Edit KWH"
            fields={fields}
            initialData={{ merk_kwh: currentKwh.merk_kwh }}
            onSubmit={(formData) => updateKwhMutation.mutate(formData)}
          />
        )}
      </SidebarInset>
    </SidebarProvider>
  );
}
