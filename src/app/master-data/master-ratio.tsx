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

export type MasterRatio = {
  id: number;
  daya: string;
  ratio: string;
};

type RatioFormData = {
  daya: string;
  ratio: string;
};

export default function MasterRatioPage() {
  const queryClient = useQueryClient();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentRatio, setCurrentRatio] = useState<MasterRatio | null>(null);

  const { data: ratiosData, isLoading } = useQuery({
    queryKey: ['master_ratios'],
    queryFn: () => apiService.get<MasterRatio[]>('/master_ratios'),
  });
  const ratios = ratiosData?.data ?? [];

  const addRatioMutation = useMutation({
    mutationFn: (newRatio: RatioFormData) => apiService.post('/master_ratios', newRatio),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['master_ratios'] });
    },
  });

  const updateRatioMutation = useMutation({
    mutationFn: (updatedRatio: RatioFormData) => apiService.put(`/master_ratios/${currentRatio!.id}`, updatedRatio),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['master_ratios'] });
      setIsEditDialogOpen(false);
    },
  });

  const deleteRatioMutation = useMutation({
    mutationFn: (id: number) => apiService.delete(`/master_ratios/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['master_ratios'] });
    },
  });

  const handleDelete = (id: number) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus data ini?")) {
      deleteRatioMutation.mutate(id);
    }
  };

  const openEditDialog = (ratio: MasterRatio) => {
    setCurrentRatio(ratio);
    setIsEditDialogOpen(true);
  };

  const fields: Field[] = [
    { id: "daya", label: "Daya", placeholder: "Masukan daya", type: "text" },
    { id: "ratio", label: "Ratio", placeholder: "Masukan ratio", type: "text" },
  ];

  const columns: ColumnDef<MasterRatio>[] = [
    { id: "no", header: "No", cell: ({ row }) => row.index + 1 },
    { accessorKey: "daya", header: "Daya", cell: ({ row }) => <div className="capitalize">{row.getValue("daya")}</div> },
    { accessorKey: "ratio", header: "Ratio", cell: ({ row }) => <div className="capitalize">{row.getValue("ratio")}</div> },
    {
      id: "aksi", header: "Aksi", cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => openEditDialog(row.original)}
            className="hover:bg-slate-200 hover:text-black bg-[#106A82] p-1 rounded-md text-white"
            title="Edit Data"
          >
            <Edit className="w-5 h-5" />
          </button>
          <button
            onClick={() => handleDelete(row.original.id)}
            className="hover:bg-slate-200 hover:text-black bg-[#EA3A3A] p-1 rounded-md text-white"
            title="Hapus Data"
          >
            <Delete className="w-5 h-5" />
          </button>
        </div>
      )
    },
  ];

  return (
    <SidebarProvider className="font-poppins">
      <AppSidebar className="w-[200px]" />
      <SidebarInset className="bg-white">
        <Header />
        <div>
          <div className="bg-white border border-[#E5E5E5] shadow-sm rounded-lg p-4 mx-5 my-5">
            <div className="flex justify-between items-center">
              <p className="font-semibold">Daftar Master Ratio</p>
              <DialogDemo<RatioFormData>
                button="Tambah Ratio"
                title="Tambah Ratio"
                fields={fields}
                onSubmit={(formData) => addRatioMutation.mutate(formData)}
                buttonColor="hover:bg-slate-200 hover:text-black bg-[#106A82] p-1 rounded-md text-white flex items-center"
              />
            </div>
            <div className="mt-5">
              {isLoading ? <p>Memuat data...</p> : <DataTable columns={columns} data={ratios} />}
            </div>
          </div>
        </div>

        {currentRatio && (
          <DialogDemo<RatioFormData>
            open={isEditDialogOpen}
            onOpenChange={setIsEditDialogOpen}
            title="Edit Ratio"
            fields={fields}
            initialData={{ daya: currentRatio.daya, ratio: currentRatio.ratio }}
            onSubmit={(formData) => updateRatioMutation.mutate(formData)}
            button="Simpan"
            buttonColor="bg-blue-600 text-white hover:bg-blue-700"
          />
        )}
      </SidebarInset>
    </SidebarProvider>
  );
}
