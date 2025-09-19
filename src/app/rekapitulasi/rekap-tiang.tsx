import { AppSidebar } from '@/components/app-sidebar';
import { DataTable } from '@/components/data-table';
import { Button } from '@/components/ui/button';
import CardTotal from '@/components/ui/card-total';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { ColumnDef } from '@tanstack/react-table';
import Header from '../dashboard/header';

export type RekapTiang = {
  nama: string;
  tipe: string;
  jenis: string;
  ukuran: string;
  kode?: string;
};

const data: RekapTiang[] = [
  {
    nama: 'GD YDS0002',
    tipe: 'TM',
    jenis: 'Besi',
    ukuran: '12/200',
  },
];

const columns: ColumnDef<RekapTiang>[] = [
  {
    id: 'no',
    header: 'No',
    cell: ({ row }) => row.index + 1,
  },
  {
    accessorKey: 'nama',
    header: 'Nama Gardu',
    cell: ({ row }) => <div className="capitalize">{row.getValue('nama')}</div>,
    enableSorting: true
  },
  {
    accessorKey: 'tipe',
    header: 'Tipe Tiang',
    cell: ({ row }) => <div className="capitalize">{row.getValue('tipe')}</div>,
    enableSorting: true
  },
  {
    accessorKey: 'jenis',
    header: 'Jenis Tiang',
    cell: ({ row }) => <div className="capitalize">{row.getValue('jenis')}</div>,
    enableSorting: true
  },
  {
    accessorKey: 'ukuran',
    header: 'Ukuran',
    cell: ({ row }) => <div className="capitalize">{row.getValue('ukuran')}</div>,
    enableSorting: true
  },
  {
    accessorKey: 'kode',
    header: 'Kode Tiang',
    cell: ({ row }) => <div className="capitalize">{row.getValue('kode')}</div>,
    enableSorting: true
  },
];

export default function RekapTiang() {
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
              <p className="font-semibold">Data Tiang</p>

              <div className="flex items-center">
                <Button className="bg-blue-950 hover:scale-95 hover:bg-slate-200 hover:text-black text-[13px] mr-1">Rekap Tiang Gardu</Button>
                <Button className="bg-blue-950 hover:scale-95 hover:bg-slate-200 hover:text-black text-[13px] mr-1">Rekap Tiang</Button>
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
