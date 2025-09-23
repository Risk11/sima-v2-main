import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import { Delete, Edit } from "lucide-react";

import apiService from "@/services/api-services";

import { AppSidebar } from "@/components/app-sidebar";
import DialogDemo from "@/components/dialog";
import { DataTable } from "@/components/data-table";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import Header from "../dashboard/header";

export type ULP = { id: number; nama_ulp: string };
export type Ratio = { id: number; ratio: string };
export type Gardu = {
  id: number;
  nama_gardu: string;
  ulp_id: number;
  ratio_id: number;
  ulp?: ULP | null;
  ratio?: Ratio | null;
  lat?: number;
  lng?: number;
};

interface Field {
  id: string;
  label: string;
  placeholder?: string;
  type?: "select" | "text" | "number";
  options?: { id: number; label?: string }[];
}

export default function MasterGardu() {
  const queryClient = useQueryClient();
  const [editData, setEditData] = useState<Gardu | null>(null);

  const { data: gardusData, isLoading: isLoadingGardus } = useQuery({
    queryKey: ["gardus"],
    queryFn: () => apiService.get<Gardu[]>("/gardus"),
  });
  const gardus = gardusData?.data ?? [];

  const { data: ulpsData } = useQuery({
    queryKey: ["ulps"],
    queryFn: () => apiService.get<ULP[]>("/ulps"),
  });
  const ulps = ulpsData?.data ?? [];

  const { data: ratiosData } = useQuery({
    queryKey: ["ratios"],
    queryFn: () => apiService.get<Ratio[]>("/master_ratios"),
  });
  const ratios = ratiosData?.data ?? [];

  const addGarduMutation = useMutation({
    mutationFn: (newGardu: Omit<Gardu, 'id'>) => apiService.post("/gardus", newGardu),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["gardus"] });
    },
    onError: (error) => {
      console.error("Error saat menambah gardu:", error);

    },
  });

  const editGarduMutation = useMutation({
    mutationFn: (updatedGardu: Partial<Gardu>) =>
      apiService.put(`/gardus/${editData!.id}`, updatedGardu),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["gardus"] });
      setEditData(null);
    },
    onError: (error) => {
      console.error("Error saat mengedit gardu:", error);
    },
  });

  const deleteGarduMutation = useMutation({
    mutationFn: (id: number) => apiService.delete(`/gardus/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["gardus"] });
    },
    onError: (error) => {
      console.error("Error saat menghapus gardu:", error);
    }
  });

  const handleDelete = (id: number) => {
    if (confirm("Yakin hapus gardu ini?")) {
      deleteGarduMutation.mutate(id);
    }
  };

  const handleFormSubmit = (formData: any) => {
    const processedData = {
      ...formData,
      ulp_id: parseInt(formData.ulp_id, 10),
      ratio_id: parseInt(formData.ratio_id, 10),
      lat: formData.lat ? parseFloat(formData.lat) : undefined,
      lng: formData.lng ? parseFloat(formData.lng) : undefined,
    };
    addGarduMutation.mutate(processedData);
  };

  const handleEditFormSubmit = (formData: any) => {
    const processedData = {
      ...formData,
      ulp_id: parseInt(formData.ulp_id, 10),
      ratio_id: parseInt(formData.ratio_id, 10),
      lat: formData.lat ? parseFloat(formData.lat) : undefined,
      lng: formData.lng ? parseFloat(formData.lng) : undefined,
    };
    editGarduMutation.mutate(processedData);
  };


  const fields: Field[] = [
    {
      id: "nama_gardu",
      label: "Nama Gardu",
      placeholder: "Masukan nama gardu",
      type: "text",
    },
    {
      id: "ulp_id",
      label: "Pilih ULP",
      type: "select",
      options: ulps.map((u) => ({ id: u.id, label: u.nama_ulp })),
    },
    {
      id: "ratio_id",
      label: "Pilih Ratio",
      type: "select",
      options: ratios.map((r) => ({ id: r.id, label: r.ratio })),
    },
    {
      id: "lat",
      label: "Latitude",
      placeholder: "Masukan lat",
      type: "number",
    },
    {
      id: "lng",
      label: "Longitude",
      placeholder: "Masukan lng",
      type: "number",
    },
  ];

  const columns: ColumnDef<Gardu>[] = [
    { id: "no", header: "No", cell: ({ row }) => row.index + 1 },
    {
      accessorKey: "nama_gardu",
      header: "Nama Gardu",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("nama_gardu")}</div>
      ),
    },
    {
      accessorKey: "ulp.nama_ulp",
      header: "ULP",
      cell: ({ row }) => (
        <div className="capitalize">{row.original.ulp?.nama_ulp ?? "-"}</div>
      ),
    },
    {
      accessorKey: "ratio.ratio",
      header: "Ratio",
      cell: ({ row }) => (
        <div className="capitalize">{row.original.ratio?.ratio ?? "-"}</div>
      ),
    },
    {
      accessorKey: "lat",
      header: "Latitude",
      cell: ({ row }) => row.original.lat ?? "-",
    },
    {
      accessorKey: "lng",
      header: "Longitude",
      cell: ({ row }) => row.original.lng ?? "-",
    },
    {
      id: "aksi",
      header: "Aksi",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => setEditData(row.original)}
            className="hover:bg-slate-200 hover:text-black bg-[#106A82] p-1 rounded-md text-white"
            title="Edit Gardu"
          >
            <Edit className="w-5 h-5" />
          </button>
          <button
            onClick={() => handleDelete(row.original.id)}
            className="hover:bg-slate-200 hover:text-black bg-[#EA3A3A] p-1 rounded-md text-white"
            title="Hapus Gardu"
          >
            <Delete className="w-5 h-5" />
          </button>
        </div>
      ),
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
              <p className="font-semibold">Daftar Gardu</p>
              <div className="flex items-center">
                <DialogDemo
                  button="Tambah Gardu"
                  title="Tambah Gardu"
                  fields={fields}
                  onSubmit={handleFormSubmit}
                  buttonColor="hover:bg-slate-200 hover:text-black bg-[#106A82] p-1 rounded-md text-white flex items-center"
                />
              </div>
            </div>
            <div className="mt-5">
              {isLoadingGardus ? (
                <p>Loading...</p>
              ) : (
                <DataTable columns={columns} data={gardus} />
              )}
            </div>
          </div>
        </div>

        {editData && (
          <DialogDemo
            open={!!editData}
            onOpenChange={(open) => !open && setEditData(null)}
            title="Edit Gardu"
            fields={fields}
            initialData={{
              nama_gardu: editData.nama_gardu,
              ulp_id: editData.ulp_id,
              ratio_id: editData.ratio_id,
              lat: editData.lat,
              lng: editData.lng,
            }}
            onSubmit={handleEditFormSubmit}
            button="Simpan"
            buttonColor="bg-blue-600 text-white hover:bg-blue-700"
          />
        )}
      </SidebarInset>
    </SidebarProvider>
  );
}
