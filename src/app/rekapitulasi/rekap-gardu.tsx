import { AppSidebar } from '@/components/app-sidebar';
import { DataTable } from '@/components/tabledemo';
import { Button } from '@/components/ui/button';
import CardTotal from '@/components/ui/card-total';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { ColumnDef } from '@tanstack/react-table';
import Header from '../dashboard/header';

export type RekapGardu = {
  nama: string;
  tipe: string;
  penyulang: string;
  tanggal: string;
  surveyor: string;
};

const data: RekapGardu[] = [
  {
    nama: 'GD CLO0031',
    tipe: 'Test',
    penyulang: 'Test juga',
    tanggal: '2025-01-01',
    surveyor: 'test',
  },
];

const columns: ColumnDef<RekapGardu>[] = [
  {
    id: 'no',
    header: 'No',
    cell: ({ row }) => row.index + 1,
  },
  {
    accessorKey: 'nama',
    header: 'Nama Admin',
    cell: ({ row }) => <div className="capitalize">{row.getValue('nama')}</div>,
    enableSorting: true
  },
  {
    accessorKey: 'tipe',
    header: 'Tipe Gardu',
    cell: ({ row }) => <div className="capitalize">{row.getValue('tipe')}</div>,
    enableSorting: true
  },
  {
    accessorKey: 'penyulang',
    header: 'Penyulang',
    cell: ({ row }) => <div className="capitalize">{row.getValue('penyulang')}</div>,
    enableSorting: true
  },
  {
    accessorKey: 'tanggal',
    header: 'Tanggal',
    cell: ({ row }) => <div className="capitalize">{row.getValue('tanggal')}</div>,
    enableSorting: true
  },
  {
    accessorKey: 'surveyor',
    header: 'Surveyor',
    cell: ({ row }) => <div>{row.getValue('surveyor')}</div>,
    enableSorting: true
  },
];

export default function RekapGardu() {
  return (
    <SidebarProvider className="font-poppins">
      <AppSidebar className="w-[200px]" />
      <SidebarInset className="bg-white">
        <Header/>

        <div className="">
          <div className="flex gap-2 justify-center">
            <CardTotal total="34.500" description="Total Tiang" textColor="text-green-600" />
            <CardTotal total="125" description="Total Kode Tiang Terisi" />
          </div>

          <div className="bg-white border border-[#E5E5E5] shadow-sm rounded-lg p-4 mx-5 my-5">
            <div className="flex justify-between items-center">
              <p className="font-semibold">Data Gardu</p>

              <div className="flex items-center">
                <Button className="bg-blue-950 hover:scale-95 hover:bg-blue-950 text-[13px] mr-1">Rekap Pelanggan Gardu</Button>
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
