import { AppSidebar } from '@/components/app-sidebar';
import SheetDemo from '@/components/sheet-demo';
import { DataTable } from '@/components/data-table';
import { Combobox } from '@/components/ui/combobox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { ColumnDef } from '@tanstack/react-table';
import { CheckCircle, Delete } from 'lucide-react';
import Header from '../dashboard/header';

export type Jadwal = {
    tanggal: string
    aksi?: string
    surveyor: string
    namaGardu: string
    keterangan: string
    penyulang: string
};

const data: Jadwal[] = [
  {
    tanggal: "2025-01-10",
    surveyor: "rizi",
    namaGardu: "GD SBG0140",
    keterangan: "Lanjutan",
    penyulang: "test aja"
  },
];

const columns: ColumnDef<Jadwal>[] = [
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
          <button className="hover:bg-slate-200 hover:text-black bg-[#ca3030] p-1 rounded-md text-white">
            <Delete className="w-5 h-5" />
          </button>
        </div>
      );
    },
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
    cell: ({ row }) => <div className="capitalize">{row.getValue('surveyor')}</div>,
    enableSorting: true
  },
  {
    accessorKey: 'namaGardu',
    header: 'Nama Gardu',
    cell: ({ row }) => <div className="capitalize">{row.getValue('namaGardu')}</div>,
    enableSorting: true
  },
  {
    accessorKey: 'keterangan',
    header: "Keterangan",
    cell: ({ row }) => <div className="capitalize">{row.getValue('keterangan')}</div>,
    enableSorting: true
  },
  {
    accessorKey: 'penyulang',
    header: "Penyulang",
    cell: ({ row }) => <div className="capitalize">{row.getValue('penyulang')}</div>,
    enableSorting: true
  }
];

export default function Jadwal() {
  const up3 = [
    { value: "Tanah Grogot", label: "Tanah Grogot" },
    { value: "Leuwigajah", label: "Leuwigajah" },
    { value: "Kademagan", label: "Kademagan" },
  ];

  const handleUP3Select = (value: string) => {
    console.log("Selected framework:", value);
  };

  return (
    <SidebarProvider className="font-poppins">
      <AppSidebar className="w-[200px] " />
      <SidebarInset className="bg-gradient-to-b from-[#FCFCFC] to-[#D9E3EA]">
      <Header/>

        <div className="">
          <div className="bg-white border border-[#E5E5E5] shadow-sm rounded-lg p-4 mx-5 my-5">
            <div className="flex justify-between items-center">
              <p className="font-semibold">Jadwal Surveyor</p>

              <div className="flex items-center">
                  <SheetDemo
                    button='Buat Jadwal'
                    title='Buat Jadwal'
                  >
                    <div className="grid grid-cols-5 items-center gap-4">
                      <Label className="text-left col-span-2">
                        Tanggal
                      </Label>
                      <Input type='date' className='w-[200px]'/>
                    </div>

                    <div className="grid grid-cols-5 items-center gap-4">
                      <Label htmlFor="framework" className="text-left col-span-2">
                        Surveyor
                      </Label>
                      <Combobox
                        options={up3}
                        placeholder="Pilih Surveyor"
                        onSelect={handleUP3Select}
                        className='w-[200px]'
                      />
                    </div>

                    <div className="grid grid-cols-5 items-center gap-4">
                      <Label htmlFor="framework" className="text-left col-span-2">
                        Gardu
                      </Label>
                      <Combobox
                        options={up3}
                        placeholder="Pilih Gardu"
                        onSelect={handleUP3Select}
                        className='w-[200px]'
                      />
                    </div>

                    <div className="grid grid-cols-5 items-center gap-4">
                      <Label className="text-left col-span-2">
                        Keterangan
                      </Label>
                      <Input type='text' className='w-[200px]'/>
                    </div>

                    <div className="grid grid-cols-5 items-center gap-4">
                      <Label className="text-left col-span-2">
                        Penyulang
                      </Label>
                      <Input type='text' className='w-[200px]'/>
                    </div>

                    <div className="grid grid-cols-5 items-center gap-4">
                      <Label className="text-left col-span-2">
                        Nama Gardu Dilapangan
                      </Label>
                      <Input type='text' className='w-[200px]'/>
                    </div>
                  </SheetDemo>
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
