import { AppSidebar } from '@/components/app-sidebar';
import { DataTable } from '@/components/data-table';
import { Button } from '@/components/ui/button';
import CardTotal from '@/components/ui/card-total';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { ColumnDef } from '@tanstack/react-table';
import Header from '../dashboard/header';

export type RekapSR = {
    tanggal: string
    namaGardu: string
    penyulang: string
    surveyor: string
    deret: string
};

const data: RekapSR[] = [
  {
    tanggal: "2025-01-01",
    namaGardu: "GD SJP0077",
    penyulang: "test aja",
    surveyor: "Eko Sutisna",
    deret: "1"
  },
];

const columns: ColumnDef<RekapSR>[] = [
  {
    id: 'no',
    header: 'No',
    cell: ({ row }) => row.index + 1,
  },
  {
    accessorKey: 'tanggal',
    header: 'Tanggal',
    cell: ({ row }) => <div className="capitalize">{row.getValue('tanggal')}</div>,
    enableSorting: true
  },
  {
    accessorKey: 'namaGardu',
    header: 'Nama Gardu',
    cell: ({ row }) => <div className="capitalize">{row.getValue('namaGardu')}</div>,
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
    accessorKey: 'deret',
    header: 'Deret',
    cell: ({ row }) => <div className="capitalize">{row.getValue('deret')}</div>,
    enableSorting: true
  },
];

export default function RekapSR() {
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
              <p className="font-semibold">Data SR Gardu</p>

              <div className="flex items-center">
                <Button className="bg-blue-950 hover:scale-95 hover:bg-slate-200 hover:text-black text-[13px] mr-1">
                    Rekap SR Gardu
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
