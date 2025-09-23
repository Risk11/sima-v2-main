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

export type ULP = { id: number; nama_ulp: string };
export type Project = { id: number; ulp?: ULP | null; ulp_id: number; target: string };

export default function MasterProject() {
  const queryClient = useQueryClient();
  const [editData, setEditData] = useState<Project | null>(null);

  const { data: projectsData, isLoading: isLoadingProjects } = useQuery({
    queryKey: ['projects'],
    queryFn: () => apiService.get<Project[]>('/projects'),
  });
  const projects = projectsData?.data ?? [];

  const { data: ulpsData } = useQuery({
    queryKey: ['ulps'],
    queryFn: () => apiService.get<ULP[]>('/ulps'),
  });
  const ulps = ulpsData?.data ?? [];

  const addProjectMutation = useMutation({
    mutationFn: (newProject: any) => apiService.post('/projects', newProject),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['projects'] }),
  });

  const editProjectMutation = useMutation({
    mutationFn: (updatedProject: any) => apiService.put(`/projects/${editData!.id}`, updatedProject),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      setEditData(null);
    },
  });

  const deleteProjectMutation = useMutation({
    mutationFn: (id: number) => apiService.delete(`/projects/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['projects'] }),
  });

  const handleDelete = (id: number) => {
    if (window.confirm("Yakin hapus project ini?")) {
      deleteProjectMutation.mutate(id);
    }
  };

  const fields: Field[] = [
    {
      id: "ulp_id", label: "Pilih ULP", type: "select",
      options: ulps.map((u) => ({ id: u.id, value: u.id, label: u.nama_ulp })),
    },
    { id: "target", label: "Target Project", type: "text", placeholder: "Masukan target project" },
  ];

  const columns: ColumnDef<Project>[] = [
    { id: "no", header: "No", cell: ({ row }) => row.index + 1 },
    { accessorKey: "ulp.nama_ulp", header: "ULP", cell: ({ row }) => <div className="capitalize">{row.original.ulp?.nama_ulp || "-"}</div> },
    { accessorKey: "target", header: "Target Project", cell: ({ row }) => <div>{row.getValue("target")}</div> },
    {
      id: "aksi", header: "Aksi", cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <button onClick={() => setEditData(row.original)} className="hover:bg-slate-200 hover:text-black bg-[#106A82] p-1 rounded-md text-white" title="Edit Project">
            <Edit className="w-5 h-5" />
          </button>
          <button onClick={() => handleDelete(row.original.id)} className="hover:bg-slate-200 hover:text-black bg-[#EA3A3A] p-1 rounded-md text-white" title="Hapus Project">
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
              <p className="font-semibold">Daftar Project</p>
              <DialogDemo
                button="Tambah Project"
                title="Tambah Project"
                fields={fields}
                onSubmit={(formData: any) => {
                  addProjectMutation.mutate({ ...formData, ulp_id: Number(formData.ulp_id) });
                }}
                buttonColor="hover:bg-slate-200 hover:text-black bg-[#106A82] p-1 rounded-md text-white flex items-center"
              />
            </div>
            <div className="mt-5">
              {isLoadingProjects ? <p>Loading...</p> : <DataTable columns={columns} data={projects} />}
            </div>
          </div>
        </div>

        {editData && (
          <DialogDemo
            open={!!editData}
            onOpenChange={(open) => !open && setEditData(null)}
            title="Edit Project"
            fields={fields}
            initialData={{ ulp_id: editData.ulp_id, target: editData.target }}
            onSubmit={(formData: any) => {
              editProjectMutation.mutate({ ...formData, ulp_id: Number(formData.ulp_id) });
            }}
            button="Simpan"
            buttonColor="bg-blue-600 text-white hover:bg-blue-700"
          />
        )}
      </SidebarInset>
    </SidebarProvider>
  );
}
