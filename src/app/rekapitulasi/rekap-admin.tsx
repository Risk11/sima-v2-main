import { AppSidebar } from '@/components/app-sidebar';
import { DataTable } from '@/components/data-table';
import { Button } from '@/components/ui/button';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { ColumnDef } from '@tanstack/react-table';
import Header from '../dashboard/header';

export type RekapAdmin = {
  nama: string;
  pelanggan: string;
};

const data: RekapAdmin[] = [
  {
    nama: 'Ahmad Saikun',
    pelanggan: '40',
  },
];

const columns: ColumnDef<RekapAdmin>[] = [
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
    accessorKey: 'pelanggan',
    header: 'Banyak Pelanggan',
    cell: ({ row }) => <div className="capitalize">{row.getValue('pelanggan')}</div>,
    enableSorting: true
  },
];

export default function RekapAdmin() {
  return (
    <SidebarProvider className="font-poppins">
      <AppSidebar className="w-[200px]" />
      <SidebarInset className="bg-gradient-to-b from-[#FCFCFC] to-[#D9E3EA]">
    <Header/>

        <div className="">
          <div className="bg-white border border-[#E5E5E5] shadow-sm rounded-lg p-4 mx-5 my-5">
            <div className="flex justify-between items-center">
              <p className="font-semibold">Data Admin</p>

              <div className="flex items-center">
                <Button className="bg-blue-950 hover:scale-95 hover:bg-slate-200 hover:text-black text-[13px] mr-1">Cek Rekap Total</Button>
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
