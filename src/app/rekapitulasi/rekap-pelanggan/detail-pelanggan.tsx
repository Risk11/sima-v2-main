import Header from "@/app/dashboard/header"
import { AppSidebar } from "@/components/app-sidebar"
import { CarouselDemo } from "@/components/carousel-demo"
import CardTotal from "@/components/ui/card-total"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { Link } from "@tanstack/react-router"
import {  X } from "lucide-react"

export default function DetailPelanggan() {
  return (
    <SidebarProvider className="font-poppins">
      <AppSidebar className="w-[200px]" />
      <SidebarInset className="bg-white">
    <Header/>
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
        <div className="bg-white border border-[#E5E5E5] shadow-sm rounded-lg p-4 mx-5 my-5 flex flex-col">
            <div className="flex justify-between my-3">
                <p>Detail Pelanggan</p>
                <Link to={'/rekapPelanggan'}>
                    <X className="cursor-pointer"/>
                </Link>
            </div>
            <div className="grid grid-cols-3">
                <div className="text-left">
                    <CarouselDemo/>
                </div>
                <div className="col-span-2 mt-1">
                    <ScrollArea className="h-[500px] rounded-md border">
                        <div className="p-4 text-left">
                            <div className="my-4 border-b">
                                <p className="font-semibold text-[#4D4D4D] text-sm">ID Pelanggan</p>
                                <p className="text-sm mt-2">233600759543</p>
                            </div>
                            <div className="my-4 border-b">
                                <p className="font-semibold text-[#4D4D4D] text-sm">NO KWH</p>
                                <p className="text-sm mt-2">0</p>
                            </div>
                            <div className="my-4 border-b">
                                <p className="font-semibold text-[#4D4D4D] text-sm">Nama Surveyor</p>
                                <p className="text-sm mt-2">AOMDANIL</p>
                            </div>
                            <div className="my-4 border-b">
                                <p className="font-semibold text-[#4D4D4D] text-sm">MCB</p>
                                <p className="text-sm mt-2">ABB</p>
                            </div>
                            <div className="my-4 border-b">
                                <p className="font-semibold text-[#4D4D4D] text-sm">Daya</p>
                                <p className="text-sm mt-2">0</p>
                            </div>
                            <div className="my-4 border-b">
                                <p className="font-semibold text-[#4D4D4D] text-sm">Keterangan</p>
                                <p className="text-sm mt-2"></p>
                            </div>
                            <div className="my-4 border-b">
                                <p className="font-semibold text-[#4D4D4D] text-sm">Tanggal</p>
                                <p className="text-sm mt-2">13-Nov-202</p>
                           </div>
                            <div className="my-4 border-b">
                                <p className="font-semibold text-[#4D4D4D] text-sm">Nama Gardu</p>
                                <p className="text-sm mt-2">GD KTC0003</p>
                            </div>
                            <div className="my-4 border-b">
                                <p className="font-semibold text-[#4D4D4D] text-sm">Penyulang</p>
                                <p className="text-sm mt-2"></p>
                            </div>
                            <div className="my-4 border-b">
                                <p className="font-semibold text-[#4D4D4D] text-sm"></p>
                                <p className="text-sm mt-2"></p>
                            </div>
                            <div className="my-4 border-b">
                                <p className="font-semibold text-[#4D4D4D] text-sm">ULP</p>
                                <p className="text-sm mt-2">Nunukan</p>
                            </div>
                            <div className="my-4 border-b">
                                <p className="font-semibold text-[#4D4D4D] text-sm">Status DIL</p>
                                <p className="text-sm mt-2">Verifikasi</p>
                            </div>
                            <div className="my-4 border-b">
                                <p className="font-semibold text-[#4D4D4D] text-sm">Alamat Pelanggan</p>
                                <p className="text-sm mt-2">Jl Pembangunan No70 Nunukan Bar Kec Nunukan Kabupaten Nunukan Kalimantan Utara 77482 Indonesia</p>
                            </div>
                        </div>
                    </ScrollArea>
                </div>
            </div>
        </div>

      </SidebarInset>
    </SidebarProvider>
  )
}
