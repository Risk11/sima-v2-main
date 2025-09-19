interface CardProps {
    nama: string;
    tanggal: string;
    pelanggan: string;
    gardu: string;
  }

const CardRekam: React.FC<CardProps>= ({nama, tanggal, pelanggan, gardu})=>{
  return (
    <div className="bg-[#F5F5F6] rounded-lg p-3 flex justify-between my-2">
        <div className="flex flex-col text-left">
        <p className="text-[15px] font-semibold">{nama}</p>
        <p className="text-[11px]">{tanggal}</p>
        <p className="text-[11px]">Gardu</p>
        </div>
        <div className="flex flex-col justify-between">
        <p className="font-semibold text-[15px]">{pelanggan}</p>
        <p className="text-[12px]">{gardu}</p>
        </div>
  </div>
  )
}

export default CardRekam