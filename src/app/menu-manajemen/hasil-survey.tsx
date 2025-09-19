import { AppSidebar } from '@/components/app-sidebar';
import { DataTable } from '@/components/data-table';
import { Button } from '@/components/ui/button';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { ColumnDef } from '@tanstack/react-table';
import Header from '../dashboard/header';

export type HasilSurvey = {
    namaGardu: string
    tanggal: string
    idpel: string
    kwh: string
    surveyor: string
};

const data: HasilSurvey[] = [
  {
    namaGardu: "GDCLO300128",
    tanggal: "2025-01-01",
    idpel: "SGKRBF211",
    kwh: "MC2000",
    surveyor: "Aditya",
  },
];

const columns: ColumnDef<HasilSurvey>[] = [
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
    accessorKey: 'idpel',
    header: 'ID Pelanggan',
    cell: ({ row }) => <div className="capitalize">{row.getValue('idpel')}</div>,
    enableSorting: true
  },
  {
    accessorKey: 'kwh',
    header: "NO KWH",
    cell: ({ row }) => <div className="capitalize">{row.getValue('kwh')}</div>,
    enableSorting: true
  },
  {
    accessorKey: 'surveyor',
    header: 'Surveyor',
    cell: ({ row }) => <div className="capitalize">{row.getValue('surveyor')}</div>,
    enableSorting: true
  },
];

export default function HasilSurvey() {
  // const [date, setDate] = React.useState<Date>();
  return (
    <SidebarProvider className="font-poppins">
      <AppSidebar className="w-[200px] " />
      <SidebarInset className="bg-gradient-to-b from-[#FCFCFC] to-[#D9E3EA]">
      <Header/>

        <div className="">
          <div className="bg-white border border-[#E5E5E5] shadow-sm rounded-lg p-4 mx-5 my-5">
            <div className="flex justify-between items-center">
              <p className="font-semibold">Data Pelanggan</p>

              <div className="flex items-center">
                <Button className="bg-[#106A82] font-poppins rounded-full mr-2">Export Detail</Button>
                <Button className="bg-[#106A82] font-poppins rounded-full">Export Harian</Button>
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
