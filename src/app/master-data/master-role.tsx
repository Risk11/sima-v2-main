import { useState } from 'react';
/* import { AppSidebar } from '@/components/app-sidebar'; */
import DialogDemo from '@/components/dialog';
import { DataTable } from '@/components/data-table';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { ColumnDef } from '@tanstack/react-table';
import { Delete } from 'lucide-react';
/* import Header from '../dashboard/header'; */

export type Role = {
  role: string;
};

export default function MasterRole() {
  const [roles, setRoles] = useState<Role[]>([
    { role: 'admin lapangan' },
    { role: 'drafter' },
    { role: 'koordinator lapangan' },
    { role: 'pihak ketiga' },
    { role: 'super admin' },
    { role: 'surveyor' },
    { role: 'validator QC' },
  ]);

  const handleDelete = (index: number) => {
    setRoles((prevRoles) => prevRoles.filter((_, i) => i !== index));
  };

  const columns: ColumnDef<Role>[] = [
    {
      id: 'no',
      header: 'No',
      cell: ({ row }) => row.index + 1,
    },
    {
      accessorKey: 'aksi',
      header: 'Aksi',
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleDelete(row.index)}
            className="hover:bg-slate-200 hover:text-black bg-[#EA3A3A] p-1 rounded-md text-white"
          >
            <Delete className="w-5 h-5" />
          </button>
        </div>
      ),
    },
    {
      accessorKey: 'role',
      header: "Role",
      cell: ({ row }) => <div className="capitalize">{row.getValue('role')}</div>,
      enableSorting: true
    },
  ];

  return (
    <SidebarProvider className="font-poppins">
      {/* <AppSidebar className="w-[200px]" /> */}
      <SidebarInset className="bg-white">
        {/* <Header/> */}

        <div>
          <div className="bg-white border border-[#E5E5E5] shadow-sm rounded-lg p-4 mx-5 my-5">
            <div className="flex justify-between items-center">
              <p className="font-semibold">Daftar Role</p>
              <DialogDemo button="Tambah Role" title="Tambah Role" fields={[{ id: "namaRole", label: "Nama Role", placeholder: "Masukkan Nama Role" }]} />
            </div>
            <div className="mt-5">
              <DataTable columns={columns} data={roles} />
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
