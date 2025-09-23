import { AppSidebar } from '@/components/app-sidebar';
import { DataTable } from '@/components/data-table';
import { Button } from '@/components/ui/button';
import CardTotal from '@/components/ui/card-total';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { ColumnDef } from '@tanstack/react-table';
import { CheckCircle, Delete} from 'lucide-react';
import Header from '../dashboard/header';

export type UpdateKelengkapan = {
    aksi?: string
    namaGardu: string
    tanggal: string
    idpel: string
    kwh: string
    surveyor: string
    statusDil: string
};

const data: UpdateKelengkapan[] = [
  {
    namaGardu: "GDCLO300128",
    tanggal: "2025-01-01",
    idpel: "SGKRBF211",
    kwh: "MC2000",
    surveyor: "Aditya",
    statusDil: "Tidak Dil"
  },
];

const columns: ColumnDef<UpdateKelengkapan>[] = [
  {
    id: 'no',
    header: 'No',
    cell: ({ row }) => row.index + 1,
  },
  {
    accessorKey: 'aksi',
    header: 'Aksi',
    cell: ({ }) => {
      return (
        <div className="flex items-center gap-2">
          <button className="hover:bg-slate-200 hover:text-black bg-[#106A82] p-1 rounded-md text-white">
            <CheckCircle className="w-5 h-5" />
          </button>
          <button className="hover:bg-slate-200 hover:text-black bg-[#EA3A3A] p-1 rounded-md text-white">
            <Delete className="w-5 h-5" />
          </button>
        </div>
      );
    },
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
    accessorKey: 'idpel',
    header: 'ID Pelanggan',
    cell: ({ row }) => <div className="capitalize">{row.getValue('idpel')}</div>,
    enableSorting: true
  },
  {
    accessorKey: 'kwh',
    header: 'KWH',
    cell: ({ row }) => <div className="capitalize">{row.getValue('kwh')}</div>,
    enableSorting: true
  },
  {
    accessorKey: 'surveyor',
    header: 'Surveyor',
    cell: ({ row }) => <div className="capitalize">{row.getValue('surveyor')}</div>,
    enableSorting: true
  },
  {
    accessorKey: 'statusDil',
    header: 'Status Dil',
    cell: ({ row }) => <div className="capitalize">{row.getValue('statusDil')}</div>,
    enableSorting: true
  },
];

export default function UpdateKelengkapan() {
  return (
    <SidebarProvider className="font-poppins">
      <AppSidebar className="w-[200px] " />
      <SidebarInset className="bg-white">
      <Header/>

          <div className="flex gap-2 justify-center">
            <CardTotal total="345.200" description="Total Pelanggan" textColor="text-green-600" />
            <CardTotal total="345" description="Total Dil" />
            <CardTotal total="1.200" description="Total Data Tidak DIL" />
            <CardTotal total="589" description="Total Data Dikunci" />
            <CardTotal total="20.459" description="Total Data NIK" />
            <CardTotal total="12" textColor="text-red-600" description="Total Data Belum Lengkap" />
          </div>
        <div className="">

          <div className="bg-white border border-[#E5E5E5]  shadow-sm rounded-lg p-4 mx-5 my-5">
            <div className="flex justify-between items-center">
              <p className="font-semibold">Data Pelanggan</p>

              <div className="flex items-center">
                <Button className="bg-blue-950 hover:scale-95 hover:bg-slate-200 hover:text-black font-poppins rounded-md">Export Data</Button>
              </div>
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
