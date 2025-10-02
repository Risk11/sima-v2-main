/* import Header from '@/app/dashboard/header'; */
/* import { AppSidebar } from '@/components/app-sidebar'; */
import { DataTable } from '@/components/data-table';
import DialogDemo from '@/components/dialog';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { ColumnDef } from '@tanstack/react-table';
import { Delete, Edit, FolderArchive, Table } from 'lucide-react';
import { useState } from 'react';

export type Menu = {
  aksi?: string;
  menu: string;
  icon?: React.ElementType;
  url: string;
};

const initialData: Menu[] = [
  {
    menu: 'master data',
    icon: Table,
    url: 'mdata',
  },
  {
    menu: 'rekapitulasi data',
    icon: FolderArchive,
    url: 'rekapdata',
  },
];

export default function MasterMenu() {
  const [data] = useState<Menu[]>(initialData);

  const columns: ColumnDef<Menu>[] = [
    {
      id: 'no',
      header: 'No',
      cell: ({ row }) => row.index + 1,
    },
    {
      accessorKey: 'aksi',
      header: 'Aksi',
      cell: ({ }) => {
        const handleEdit = () => {

        };

        return (
          <div className="flex items-center gap-2">
            <button
              onClick={handleEdit}
              className="hover:bg-slate-200 hover:text-black bg-[#106A82] p-1 rounded-md text-white"
            >
              <Edit className="w-5 h-5" />
            </button>
            <button className="hover:bg-slate-200 hover:text-black bg-[#EA3A3A] p-1 rounded-md text-white">
              <Delete className="w-5 h-5" />
            </button>
          </div>
        );
      },
    },
    {
      accessorKey: 'menu',
      header: 'Menu',
      cell: ({ row }) => <div className="capitalize">{row.getValue('menu')}</div>,
      enableSorting: true
    },
    {
      accessorKey: 'icon',
      header: 'Icon',
      cell: ({ row }) => {
        const IconComponent = row.original.icon;
        return IconComponent ? <IconComponent className="w-5 h-5 text-gray-700" /> : null;
      },
      enableSorting: true
    },
    {
      accessorKey: 'url',
      header: 'URL',
      cell: ({ row }) => <div className="captalize">{row.getValue('url')}</div>,
      enableSorting: true
    },
  ];

  const fields = [
    {
      id: "menu",
      label: "Nama Menu",
      placeholder: "Masukan Nama Menu"
    },
    {
      id: "icon",
      label: "Icon",
      placeholder: "Masukan Icon"
    },
    {
      id: "url",
      label: "URL Menu",
      placeholder: "Masukan URL Menu"
    }
  ];

  return (
    <SidebarProvider className="font-poppins">
      {/* <AppSidebar className="w-[200px]" /> */}
      <SidebarInset className="bg-white">
        {/* <Header /> */}

        <div className="">
          <div className="bg-white border border-[#E5E5E5] shadow-sm rounded-lg p-4 mx-5 my-5">
            <div className="flex justify-between items-center">
              <p className="font-semibold">Daftar Menu</p>

              <div className="flex items-center">
                <DialogDemo
                  button='Tambah Menu'
                  title='Tambah Menu'
                  fields={fields}
                >
                </DialogDemo>
              </div>
            </div>
            <div className="mt-5">
              <DataTable columns={columns} data={data} className='w-screen' />
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}