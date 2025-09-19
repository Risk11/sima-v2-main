import Header from "@/app/dashboard/header"
import { AppSidebar } from "@/components/app-sidebar"
import { DataTable } from "@/components/tabledemo"
import { Button } from "@/components/ui/button"
import CardTotal from "@/components/ui/card-total"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { Link } from "@tanstack/react-router"
import { ColumnDef } from "@tanstack/react-table";

export type Pelanggan = {
  id: string;
  detail?: string;
  gardu: string;
  tanggal: string;
  idpel: string;
  kwh: string;
  surveyor: string;
  statusdil: string;
  objectid: string;
};


const data: Pelanggan[] = [
  {
    id: "1",
    gardu: "GD SRK0030",
    tanggal: "2025-01-01",
    idpel: "232320002673",
    kwh: "05K24245",
    surveyor: "WAWAN",
    statusdil: "Tidak Dil",
    objectid: "000001",
  },
  {
    id: "2",
    gardu: "GD CDH29411",
    tanggal: "2025-01-02",
    idpel: "134123124",
    kwh: "05K24245",
    surveyor: "WIWIN",
    statusdil: "Dil",
    objectid: "000002",
  },
];


const columns: ColumnDef<Pelanggan>[] = [
  {
    id: "no",
    header: "No",
    cell: ({ row }) => row.index + 1,
  },
  {
    accessorKey: "detail",
    header: "Detail",
    cell: ({ }) => {
      return (
        <Link to={'/detailPelanggan'}>
          <button
            className=" hover:text-blue-700 flex items-center gap-2"
          >
            <img src="src\assets\detail.png" alt="icon-detail" className="w-[30px] h-[30px]" />
          </button>
        </Link>
      );
    },
  },
  {
    accessorKey: "gardu",
    header: 'Gardu',
    cell: ({ row }) => <div className="capitalize">{row.getValue("gardu")}</div>,
    enableSorting: true
  },
  {
    accessorKey: "tanggal",
    header: 'Tanggal',
    cell: ({ row }) => <div className="lowercase">{row.getValue("tanggal")}</div>,
    enableSorting: true
  },
  {
    accessorKey: "idpel",
    header: 'ID Pelanggan',
    cell: ({ row }) => <div className="lowercase">{row.getValue("idpel")}</div>,
    enableSorting: true
  },
  {
    accessorKey: "kwh",
    header: 'No KWH',
    cell: ({ row }) => <div className="lowercase">{row.getValue("kwh")}</div>,
    enableSorting: true
  },
  {
    accessorKey: "surveyor",
    header: "Surveyor",
    cell: ({ row }) => <div>{row.getValue("surveyor")}</div>,
    enableSorting: true
  },
  {
    accessorKey: "statusdil",
    header: 'Status DIL',
    cell: ({ row }) => <div className="lowercase">{row.getValue("statusdil")}</div>,
    enableSorting: true
  },
  {
    accessorKey: "objectid",
    header: 'Object ID',
    cell: ({ row }) => <div className="lowercase">{row.getValue("objectid")}</div>,
    enableSorting: true
  },
];


export default function Pelanggan() {
  return (
    <SidebarProvider className="font-poppins">
      <AppSidebar className="w-[200px]" />
      <SidebarInset className="bg-gradient-to-b from-[#FCFCFC] to-[#D9E3EA]">
    <Header/>

        <div className="">
            <div className="flex gap-2 justify-center">
                <CardTotal
                    total="345.200"
                    description="Total Pelanggan"
                    textColor="text-green-600"/>
                <CardTotal
                    total="345"
                    description="Total Dil"/>
                <CardTotal
                    total="1.200"
                    description="Total Data Tidak DIL"/>
                <CardTotal
                    total="589"
                    description="Total Data Dikunci"/>
                <CardTotal
                    total="20.459"
                    description="Total Data NIK"/>
                <CardTotal
                    total="12"
                    textColor="text-red-600"
                    description="Total Data Belum Lengkap"/>
            </div>

            <div className="bg-white border border-[#E5E5E5] shadow-sm rounded-lg p-4 mx-5 my-5">
                <div className="flex justify-between items-center">
                    <p className="font-semibold">Data Pelanggan</p>

                    <div className="flex items-center">
                        <p className="mr-4 text-sm">Rekap</p>
                        <Button className="bg-[#AAE1FC] text-[13px] text-black rounded-full hover:bg-[#0475AE] hover:text-white mr-1">Seluruh Pelanggan</Button>
                        <Button className="bg-[#AAE1FC] text-[13px] text-black rounded-full hover:bg-[#0475AE] hover:text-white mr-1">Harian</Button>
                        <Button className="bg-[#AAE1FC] text-[13px] text-black rounded-full hover:bg-[#0475AE] hover:text-white">Pelanggan Surveyor</Button>
                    </div>
                </div>
                <div className="mt-5">
                  <DataTable columns={columns} data={data} />
                </div>
            </div>
        </div>

      </SidebarInset>
    </SidebarProvider>
  )
}
