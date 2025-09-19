import { AppSidebar } from '@/components/app-sidebar';
import { DataTable } from '@/components/data-table';
import { Button } from '@/components/ui/button';
import CardTotal from '@/components/ui/card-total';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { ColumnDef } from '@tanstack/react-table';
import Header from '../dashboard/header';

export type RekapSUTR = {
    namaGardu: string
    tanggal: string
    penyulang: string
    surveyor: string
    namaProject: string
};

const data: RekapSUTR[] = [
  {
    tanggal: "2025-01-01",
    namaGardu: "GD SJP0077",
    penyulang: "test aja",
    surveyor: "Eko Sutisna",
    namaProject: "30-11-2024_SJP0077"
  },
];

const columns: ColumnDef<RekapSUTR>[] = [
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
    accessorKey: 'penyulang',
    header: 'Penyulang',
    cell: ({ row }) => <div className="capitalize">{row.getValue('penyulang')}</div>,
    enableSorting: true
  },
  {
    accessorKey: 'surveyor',
    header: 'Surveyor',
    cell: ({ row }) => <div className="capitalize">{row.getValue('surveyor')}</div>,
    enableSorting: true
  },
  {
    accessorKey: 'namaProject',
    header: 'Nama Project',
    cell: ({ row }) => <div className="capitalize">{row.getValue('namaProject')}</div>,
    enableSorting: true
  },
];

export default function RekapSUTR() {
  return (
    <SidebarProvider className="font-poppins">
      <AppSidebar className="w-[200px]" />
      <SidebarInset className="bg-gradient-to-b from-[#FCFCFC] to-[#D9E3EA]">
      <Header/>

        <div className="">
          <div className="flex gap-2 justify-center">
            <CardTotal total="345" description="Total Gardu" textColor="text-green-600" />
            <CardTotal total="125" description="Total Kode Tiang Terisi" />
          </div>

          <div className="bg-white border border-[#E5E5E5] shadow-sm rounded-lg p-4 mx-5 my-5">
            <div className="flex justify-between items-center">
              <p className="font-semibold">Data SUTR Gardu</p>

              <div className="flex items-center">
                <Button className="bg-blue-950 hover:scale-95 hover:bg-slate-200 hover:text-black text-[13px] mr-1">
                    Rekap SUTR Gardu
                </Button>
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
