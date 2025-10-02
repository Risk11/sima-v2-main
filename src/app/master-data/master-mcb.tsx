import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import { Delete, Edit } from "lucide-react";
import type { Field } from "@/components/dialog";
import apiService from "@/services/api-services";
import DialogDemo from "@/components/dialog";
import { DataTable } from "@/components/data-table";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";


export type MCB = {
  id: number;
  merk_mcb: string;
};

type McbFormData = {
  merk_mcb: string;
};

export default function MasterMCB() {
  const queryClient = useQueryClient();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentMcb, setCurrentMcb] = useState<MCB | null>(null);

  const { data: mcbData, isLoading } = useQuery({
    queryKey: ['mcbs'],
    queryFn: () => apiService.get<MCB[]>('/mcbs'),
  });
  const mcbs = mcbData?.data ?? [];

  const addMcbMutation = useMutation({
    mutationFn: (newMcb: McbFormData) => apiService.post('/mcbs', newMcb),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mcbs'] });
    },
  });

  const updateMcbMutation = useMutation({
    mutationFn: (updatedMcb: McbFormData) => apiService.put(`/mcbs/${currentMcb!.id}`, updatedMcb),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mcbs'] });
      setIsEditDialogOpen(false);
    },
  });

  const deleteMcbMutation = useMutation({
    mutationFn: (id: number) => apiService.delete(`/mcbs/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mcbs'] });
    },
  });

  const handleDelete = (id: number) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus merk ini?")) {
      deleteMcbMutation.mutate(id);
    }
  };

  const openEditDialog = (mcb: MCB) => {
    setCurrentMcb(mcb);
    setIsEditDialogOpen(true);
  };

  const fields: Field[] = [
    {
      id: "merk_mcb",
      label: "Merk MCB",
      placeholder: "Masukan Merk MCB",
    },
  ];

  const columns: ColumnDef<MCB>[] = [
    { id: "no", header: "No", cell: ({ row }) => row.index + 1 },
    {
      accessorKey: "merk_mcb",
      header: "Merk MCB",
      cell: ({ row }) => <div className="capitalize">{row.getValue("merk_mcb")}</div>,
    },
    {
      id: "aksi", header: "Aksi", cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => openEditDialog(row.original)}
            className="hover:bg-slate-200 hover:text-black bg-[#106A82] p-1 rounded-md text-white flex items-center"
          >
            <Edit className="w-5 h-5" />
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

  return (
    <SidebarProvider className="font-poppins">
      {/* <AppSidebar className="w-[200px]" /> */}
      <SidebarInset className="bg-white">
        {/* <Header /> */}
        <div>
          <div className="bg-white border border-[#E5E5E5] shadow-sm rounded-lg p-4 mx-5 my-5">
            <div className="flex justify-between items-center">
              <p className="font-semibold">Daftar MCB</p>
              <DialogDemo<McbFormData>
                button="Tambah MCB"
                title="Tambah MCB"
                fields={fields}
                onSubmit={(formData) => addMcbMutation.mutate(formData)}
              />
            </div>
            <div className="mt-5">
              {isLoading ? (
                <p>Memuat data...</p>
              ) : (
                <DataTable columns={columns} data={mcbs} />
              )}
            </div>
          </div>
        </div>

        {currentMcb && (
          <DialogDemo<McbFormData>
            open={isEditDialogOpen}
            onOpenChange={setIsEditDialogOpen}
            title="Edit MCB"
            fields={fields}
            initialData={{ merk_mcb: currentMcb.merk_mcb }}
            onSubmit={(formData) => updateMcbMutation.mutate(formData)}
          />
        )}
      </SidebarInset>
    </SidebarProvider>
  );
}
