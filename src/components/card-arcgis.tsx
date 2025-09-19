import { CheckCircle, CircleX } from 'lucide-react'
import CardTotal from './ui/card-total'

export default function CardArcgis() {
  return (
    <div className="mt-4 bg-white border border-[#E5E5E5] shadow-sm rounded-lg p-4 text-left">
    <p className="mb-3 font-semibold">Data Validasi Arcgis Online</p>
    <div className="grid grid-cols-4 gap-2">
      <CardTotal
        icon={CheckCircle}
        iconColor='text-green-500'
        total="2.890"
        description="Sudah Valid"
        textColor="text-green-500"/>
      <CardTotal
        icon={CircleX}
        iconColor='text-red-500'
        total="50"
        description="Belum Valid"
        textColor="text-red-500"/>
      <CardTotal
        total="1"
        description="IDPEL Duplikat"/>
      <CardTotal
        total="161"
        description="Foto Reject"/>
    </div>
    <div className="grid grid-cols-4 gap-2">
      <CardTotal
        total="279"
        description="Verifikasi"/>
      <CardTotal
        total="35"
        description="Tidak Ada Keterangan"/>
      <CardTotal
        total="42,24km"
        description="Panjang SR"/>
      <CardTotal
        total="106,87km"
        description="Panjang JTR"/>
    </div>
  </div>
  )
}
