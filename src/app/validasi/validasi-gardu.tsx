import { AppSidebar } from '@/components/app-sidebar';
import DialogDemo from '@/components/dialog';
import { DataTable } from '@/components/data-table';
import CardTotal from '@/components/ui/card-total';
import { Combobox } from '@/components/ui/combobox';
import { Label } from '@/components/ui/label';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@radix-ui/react-tooltip';
import { ColumnDef } from '@tanstack/react-table';
import { CheckCircle, Delete, RefreshCcwDotIcon, TabletSmartphone, Upload } from 'lucide-react';
import Header from '../dashboard/header';

export type ValidasiGardu = {
  aksi?: string;
  admin: string;
  pelserv?: string;
  perargol?: string;
  gardu: string;
  tanggalSurvei: string;
  surveyor: string;
  tanggalLaporan: string;
  keterangan?: string;
  idLaporan: string;
};

const data: ValidasiGardu[] = [
  {
    admin: 'admin_esa1',
    gardu: 'GB BOLONG',
    tanggalSurvei: '2025-01-01',
    surveyor: 'SLAMET',
    tanggalLaporan: '2025-01-01',
    keterangan: '',
    idLaporan: '2619',
  },
  {
    admin: 'admin_esa1',
    gardu: 'GB BOLONG',
    tanggalSurvei: '2025-01-01',
    surveyor: 'SLAMET',
    tanggalLaporan: '2025-01-01',
    keterangan: '',
    idLaporan: '2619',
  },
  {
    admin: 'admin_esa1',
    gardu: 'GB BOLONG',
    tanggalSurvei: '2025-01-01',
    surveyor: 'SLAMET',
    tanggalLaporan: '2025-01-01',
    keterangan: '',
    idLaporan: '2619',
  },
  {
    admin: 'admin_esa1',
    gardu: 'GB BOLONG',
    tanggalSurvei: '2025-01-01',
    surveyor: 'SLAMET',
    tanggalLaporan: '2025-01-01',
    keterangan: '',
    idLaporan: '2619',
  },
  {
    admin: 'admin_esa1',
    gardu: 'GB BOLONG',
    tanggalSurvei: '2025-01-01',
    surveyor: 'SLAMET',
    tanggalLaporan: '2025-01-01',
    keterangan: '',
    idLaporan: '2619',
  },
];

const columns: ColumnDef<ValidasiGardu>[] = [
  {
    id: 'no',
    header: 'No',
    cell: ({ row }) => row.index + 1,
  },
  {
    accessorKey: "aksi",
    header: "Aksi",
    cell: () => {
      return (
        <TooltipProvider delayDuration={0}>
          <div className="flex items-center gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <button className="hover:bg-slate-200 hover:text-black bg-[#106A82] p-1 rounded-md text-white transition">
                  <Upload className="w-5 h-5" />
                </button>
              </TooltipTrigger>
              <TooltipContent
                className="bg-white text-black rounded-lg px-3 py-1 text-sm shadow-lg border border-gray-200"
                sideOffset={5}
              >
                Upload
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <button className="hover:bg-slate-200 hover:text-black bg-[#106A82] p-1 rounded-md text-white transition">
                  <CheckCircle className="w-5 h-5" />
                </button>
              </TooltipTrigger>
              <TooltipContent
                className="bg-white text-black rounded-lg px-3 py-1 text-sm shadow-lg border border-gray-200"
                sideOffset={5}
              >
                Verifikasi
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <button className="hover:bg-slate-200 hover:text-black bg-[#106A82] p-1 rounded-md text-white transition">
                  <TabletSmartphone className="w-5 h-5" />
                </button>
              </TooltipTrigger>
              <TooltipContent
                className="bg-white text-black rounded-lg px-3 py-1 text-sm shadow-lg border border-gray-200"
                sideOffset={5}
              >
                Lihat Bukti
            </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <button className="hover:bg-slate-200 hover:text-black bg-[#EA3A3A] p-1 rounded-md text-white transition">
                  <Delete className="w-5 h-5" />
                </button>
              </TooltipTrigger>
              <TooltipContent
                className="bg-white text-black rounded-lg px-3 py-1 text-sm shadow-lg border border-gray-200"
                sideOffset={5}
              >
                Hapus
              </TooltipContent>
            </Tooltip>
          </div>
        </TooltipProvider>
      );
    },
  },
  {
    accessorKey: 'admin',
    header: 'Nama Admin',
    cell: ({ row }) => <div className="capitalize">{row.getValue('admin')}</div>,
    enableSorting: true
  },
  {
    accessorKey: 'pelserv',
    header: 'PEL SERV',
    cell: ({ row }) => <div className="capitalize">{row.getValue('pelserv')}</div>,
    enableSorting: true
  },
  {
    accessorKey: 'perargol',
    header: 'PER ARGOL',
    cell: ({ row }) => <div className="capitalize">{row.getValue('perargol')}</div>,
    enableSorting: true
  },
  {
    accessorKey: 'gardu',
    header: 'Nama Gardu',
    cell: ({ row }) => <div className="capitalize">{row.getValue('gardu')}</div>,
    enableSorting: true
  },
  {
    accessorKey: 'tanggalSurvei',
    header: 'Tanggal Survey',
    cell: ({ row }) => <div className="capitalize">{row.getValue('tanggalSurvei')}</div>,
    enableSorting: true
  },
  {
    accessorKey: 'surveyor',
    header: 'Nama Surveyor',
    cell: ({ row }) => <div className="capitalize">{row.getValue('surveyor')}</div>,
    enableSorting: true
  },
  {
    accessorKey: 'tanggalLaporan',
    header: 'Tanggal Laporan',
    cell: ({ row }) => <div className="capitalize">{row.getValue('tanggalLaporan')}</div>,
    enableSorting: true
  },
  {
    accessorKey: 'keterangan',
    header: 'Keterangan',
    cell: ({ row }) => <div className="capitalize">{row.getValue('keterangan')}</div>,
    enableSorting: true
  },
  {
    accessorKey: 'idLaporan',
    header: 'ID Laporan',
    cell: ({ row }) => <div className="capitalize">{row.getValue('idLaporan')}</div>,
    enableSorting: true
  },
];

export default function ValidasiGardu() {
  const up3 = [
    { value: "Tanah Grogot", label: "Tanah Grogot" },
    { value: "Leuwigajah", label: "Leuwigajah" },
    { value: "Kademagan", label: "Kademagan" },
  ];

  const handleUP3Select = (value: string) => {
    console.log("Selected framework:", value);
  };

  const fields=[
    {
      id: "keterangan",
      label: "Keterangan",
      placeholder: "Masukan Keterangan"
    }
  ]
  return (
    <SidebarProvider className="font-poppins">
      <AppSidebar className="w-[200px] " />
      <SidebarInset className="bg-white">
      <Header/>
          <div className="flex gap-2 justify-center">
            <CardTotal 
              total="345.200" 
              description="Total Pelanggan" 
              textColor="text-white" 
              className='bg-sky-300'/>
            <CardTotal total="345" description="Total Dil" />
            <CardTotal total="1.200" description="Total Data Tidak DIL" />
            <CardTotal total="589" description="Total Data Dikunci" />
            <CardTotal total="20.459" description="Total Data NIK" />
            <CardTotal total="12" textColor="text-red-600" description="Total Data Belum Lengkap" />
          </div>

        <div className="">
          <div className="bg-white border border-[#E5E5E5] shadow-sm rounded-lg p-4 mx-5 my-5">
            <div className="flex justify-between items-center">
              <p className="font-semibold">BA Gardu</p>

              <div className="flex items-center">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <RefreshCcwDotIcon className="mr-3 cursor-pointer hover:scale-95"></RefreshCcwDotIcon>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-[10px] bg-slate-50 p-2 rounded-md  ">
                        Refresh Pelanggan Online <br /> dan Arcgis Online
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <DialogDemo
                  button='Buat BA Gardu'
                  title='Buat BA Gardu'
                  fields={fields}>
                  {(handleClose) => (
                    <>                  
                    <div className="grid grid-cols-5 items-center gap-4">
                      <Label htmlFor="framework" className="text-left col-span-2">
                        Tanggal
                      </Label>
                      <Combobox
                        options={up3}
                        placeholder="Pilih Tanggal"
                        onSelect={handleUP3Select}
                      />
                    </div>

                    <div className="grid grid-cols-5 items-center gap-4">
                      <Label htmlFor="framework" className="text-left col-span-2">
                        Surveyor
                      </Label>
                      <Combobox
                        options={up3}
                        placeholder="Pilih Surveyor"
                        onSelect={handleUP3Select}
                      />
                    </div>

                    <div className="grid grid-cols-5 items-center gap-4">
                      <Label htmlFor="framework" className="text-left col-span-2">
                        Nama Gardu
                      </Label>
                      <Combobox
                        options={up3}
                        placeholder="Pilih Nama Gardu"
                        onSelect={handleUP3Select}
                      />
                    </div>
                  </>
                  )}
                   
                </DialogDemo>
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
