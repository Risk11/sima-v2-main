
import { CheckCircle, CircleX } from 'lucide-react'
import CardTotal from './ui/card-total'

export default function CardPelanggan() {
  return (
    <div className="bg-white border border-2 border-sky-400 shadow-sm rounded-lg p-4 text-left">
        <p className="mb-3 font-semibold">Validasi ID Pelanggan</p>
        <div className="grid grid-cols-4 gap-2">
        <CardTotal
            icon={CheckCircle}
            iconColor='text-green-500'
            total="65.000"
            description="Tervalidasi"
            textColor="text-green-500"/>
        <CardTotal
            icon={CircleX}
            iconColor='text-red-500'
            total="223"
            textColor='text-red-500'
            description="Data Tidak Dil"/>
        <CardTotal
            total="12.123"
            description="Data Dikunci"/>
        <CardTotal
            total="4.212"
            description="Data NIK"/>
        </div>

        <div className="grid grid-cols-4 gap-2">
        <CardTotal
            total="2.231"
            description="Data Belum Lengkap"/>
        <CardTotal
            total="54"
            description="Data Verifikasi"/>
        <CardTotal
            className="col-span-2"
            total="12.932"
            description="Pelanggan Masuk Arcgis Online"/>
        </div>
  </div>
  )
}
