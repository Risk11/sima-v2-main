import { AppSidebar } from '@/components/app-sidebar';
import { DataTable } from '@/components/data-table';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { ColumnDef } from '@tanstack/react-table';
import { Download } from 'lucide-react';
import Header from '../dashboard/header';

export type DownloadFoto = {
    namaGardu: string
    aksi?: string
    tanggal: string
};

const data: DownloadFoto[] = [
  {
    tanggal: "2025-01-10",
    namaGardu: "GD SBG0140",
  },
];

const columns: ColumnDef<DownloadFoto>[] = [
  {
    id: 'no',
    header: 'No',
    cell: ({ row }) => row.index + 1,
  },
  {
    accessorKey: 'namaGardu',
    header: 'Nama Gardu',
    cell: ({ row }) => <div className="capitalize">{row.getValue('namaGardu')}</div>,
    enableSorting: true
  },
  {
    accessorKey: 'tanggal',
    header: 'Tanggal',
    cell: ({ row }) => <div className="capitalize">{row.getValue('tanggal')}</div>,
    enableSorting: true
  },
  {
    accessorKey: 'aksi',
    header: 'Aksi',
    cell: ({ }) => {
      return (
        <div className="flex items-center gap-2">
          <button className="hover:bg-slate-200 flex gap-2 items-center hover:text-black bg-[#106A82] p-1 rounded-md text-white">
            <Download className="w-5 h-5" />
            Download
          </button>
        </div>
      );
    },
  },
];

export default function DownloadFoto() {
  return (
    <SidebarProvider className="font-poppins">
      <AppSidebar className="w-[200px] " />
      <SidebarInset className="bg-gradient-to-b from-[#FCFCFC] to-[#D9E3EA]">
      <Header/>

        <div className="">
          <div className="bg-white border border-[#E5E5E5] shadow-sm rounded-lg p-4 mx-5 my-5">
            <div className="flex justify-between items-center">
              <p className="font-semibold">Download Foto Pelanggan Menurut Gardu</p>
            </div>
            <div className="mt-5">
              <DataTable columns={columns} data={data} />
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
