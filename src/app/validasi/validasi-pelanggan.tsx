"use client";

import { useEffect, useState, useMemo, useCallback, useRef } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import CardTotal from "@/components/ui/card-total";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { ColumnDef } from "@tanstack/react-table";
import { Edit, Save, XCircle, CheckCircle, Search, RotateCcw, ChevronLeft, ChevronRight, UserCheck, Loader2 } from "lucide-react";
import Header from "../dashboard/header";
import apiService from "@/services/api-services";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Toaster, toast } from 'sonner';
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
// import { Textarea } from "@/components/ui/textarea"; 

// 1. TIPE DATA
export interface PhotoInfo {
  original: string;
  converted: string | null;
  status: "available" | "unavailable";
}

export type ValidasiPelanggan = {
  idpel: string;
  kwh: string | null;
  statusDil: string | null;
  namaGardu: string | null;
  photo_urls?: string[] | null;
  no_seri_kwh: string | null;
  status_dil: string | null;
  usergambar: string | null;
  KODE_GARDU: string | null;
  merk_kwh_meter: string | null;
  tahun_buat_kwh: string | null;
  jenis_kwh_meter: string | null;
  fasa_jaringan: string | null;
  mcb_ampere: string | null;
  mcb_fasa: string | null;
  keterangan: string | null;
  DAYA: string | null;
  MERK_PEMBATAS: string | null;
  JENIS_PEMBATAS: string | null;
  statusValidasi?: string | null;
  photos: PhotoInfo[];
};

export type SummaryData = {
  totalPelanggan: number;
  totalDil: number;
  tidakDil: number;
  dikunci: number;
  belumLengkap: number;
};

export interface PagePaginatedResponse<T> {
  data: T[];
  current_page: number;
  per_page: number;
  next_page: number | null;
  prev_page: number | null;
}

export type PelangganFilters = {
  idpel: string;
  kwh: string;
  statusDil: string;
  namaGardu: string;
};


// 2. KONSTANTA
const PELANGGAN_LAYER_URL =
  "https://dms.duniacommunica.co.id/gispro3/rest/services/PLN_PERBAIKAN_NUNUKAN/MapServer/1";

const statusStyles: { [key: string]: string } = {
  DIL: "bg-green-100 text-green-800",
  DIKUNCI: "bg-gray-200 text-gray-800",
  DIL_IDPEL: "bg-blue-100 text-blue-800",
  DIL_NOKWH: "bg-yellow-100 text-yellow-800",
  "Belum Lengkap": "bg-red-100 text-red-800",
};

const statusDilOptions = [
  "DIL",
  "Belum Lengkap",
  "DIL_NOKWH",
  "DIL_IDPEL",
  "DIKUNCI",
];

const statusDilModalOptions = ["Cek Database Data Dil", "DIL WEB", "VERIFIKASI", "DIL", "DIL_IDPEL", "DIL_NOKWH", "NO_DIL", "DIKUNCI", "NK"];
const merkKwhMeterOptions = ["TIDAK DAPAT DIDATA", "ITRON", "HEXING", "MELCOINDA", "SANXING", "METBELOSA", "SMARTMETER", "CANNET", "MECOINDO", "SIGMA", "FUJI DHARMA ELECTRIC", "ADTECH", "EMAIL LTD.", "MEISYS", "METRICO", "STAR", "ACTARIS", "SHENZHEN", "MERK LAIN", "WASION", "SCHLUMBERGER", "EDMI"];
const jenisKwhMeterOptions = ["AMR", "Elektronik", "PLC", "Mekanik", "Prabayar", "SPDA DENGAN RADIO FREQUENCY", "SPDA DENGAN GSM", "SPDA DENGAN PLC", "TIDAK DAPAT DIDATA"];
const fasaJaringanOptions = ["1 FASA", "3 FASA", "TIDAK DAPAT DIDATA"];
const mcbAmpereOptions = ["2A", "4A", "6A", "10A", "16A", "20A", "25A", "30A", "35A", "50A", "10A x 3", "16A x 3", "20A x 3", "25A x 3", "35A x 3", "50A x 3", "63A x 3", "82A x 3", "100A x 3", "125A x 3", "160A x 3", "200A x 3", "250A x 3", "300A x 3", "500A x 3", "630A x 3", "BURAM/TERHAPUS", "TIDAK ADA MCB", "LAIN-LAIN", "TIDAK DAPAT DIDATA"];
const mcbFasaOptions = ["1 FASA", "3 FASA", "TIDAK DAPAT DIDATA"];
const keteranganOptions = ["NORMAL", "RUMAH BERPAGAR", "KWH METER SUSAH DIJANGKAU", "KWH METER BURAM", "PELANGGAN TIDAK MAU DIDATA", "KWH METER RUSAK", "ADA POTENSI PELANGGARAN LISTRIK", "RUMAH KOSONG", "KWH METER TIDAK ADA", "ADA ANJING GALAK", "KWH METER DI DALAM RUMAH"];
const merkPembatasOptions = ["ABB", "ADB", "AEG", "ALISINDO", "ASJX", "ATN", "augen", "BBC", "BEAL BLU", "BERKO", "BOSS", "BRIGHT", "BROCO", "BURAM", "CHINT", "CYBER", "DAECO", "DAYA", "DEKSON", "DEUST", "DHARMA", "DIXSEN", "DOMAE", "DUTRON", "EDMI", "ELEKTRO", "ELITECH", "ELTRA", "EPS", "ETA", "EWIG", "F&G PX200", "FLACHYCON", "FONIC", "FUJI DHARMA", "FUJI FOTO BERLI", "GEN STAR", "HAGER", "HANNOCHS", "HIMEL", "HONEYWELL", "HONGWANG", "HOSEKI", "HSC", "HTC", "HUA JIA", "HVGK", "INS INTERNASIONAL", "INSOOM", "ITAMI", "IZUMLI", "JDATA", "JIALUO", "JOVEAN", "JPE PX 200", "KAMIYA", "KANSEN", "KAWACHI", "KINGS", "KISHOO", "KLASSE", "KOMSAN", "KYOWA", "LIKON", "LO&FO", "LS BKN", "LUVINDO", "MASAKI", "MASAKO", "MASKO", "MATSHUKA", "MEET", "MEIKO", "MEILAN RILAN/SZMR", "MENTARI", "MERLIN GERIN/MULTI9", "METASOL", "METEOR", "MITSUBISHI", "MORGEN", "NADER", "NEOLUS", "NEW PALLAS", "NORGEN", "OKACHI", "ONESTO", "P&G PX 200", "PAKUS", "PANCARAN", "POWELL", "RENO", "S161", "SAKURA", "SALUX", "SANLY", "SCHNEIDER", "SENTEN", "SHIHLIN", "SHIYOTA", "SHUKAKU", "SIEMENS", "SIGMA ELECTRIC", "SINSEKI", "SONGRUI", "SONGXIA", "STARS", "SUNFA", "SUNFREE", "TAZEN", "TBC", "TIDAK ADA MCB", "TKE", "TOYOSAKI", "TYS", "VECAS", "VIKERS", "VISALUX", "VYBA", "VYNCKIER", "WAKAMOTO", "WANDA", "WIN", "YAKI", "YIJIA", "YOSHIKAWA", "YUAND", "ZENITH"];
const jenisPembatasOptions = ["MCB", "MCCB"];
const validasiOptions = ["SUDAH VALID", "BELUM VALIDASI", "IDPEL DUPLIKASI", "FOTO REJECT", "VERIFIKASI", "LAINNYA"];


// 3. SERVICE FUNCTION
async function fetchFeaturePhotos(idpel: string): Promise<string[]> {
  try {
    const featureQueryUrl = `${PELANGGAN_LAYER_URL}/query?where=IDPEL='${idpel}' OR ID_PELANGGAN='${idpel}'&outFields=OBJECTID&f=json`;
    const featureResponse = await fetch(featureQueryUrl);
    if (!featureResponse.ok) throw new Error(`HTTP error! status: ${featureResponse.status}`);
    const featureData = await featureResponse.json();
    if (!featureData.features || featureData.features.length === 0) return [];
    const objectId = featureData.features[0].attributes.OBJECTID;
    const attachmentsQueryUrl = `${PELANGGAN_LAYER_URL}/${objectId}/attachments?f=json`;
    const attachmentsResponse = await fetch(attachmentsQueryUrl);
    if (!attachmentsResponse.ok) throw new Error(`HTTP error! status: ${attachmentsResponse.status}`);
    const attachmentsData = await attachmentsResponse.json();
    if (attachmentsData.attachmentInfos && attachmentsData.attachmentInfos.length > 0) {
      return attachmentsData.attachmentInfos.map((att: { id: number }) => `${PELANGGAN_LAYER_URL}/${objectId}/attachments/${att.id}`);
    }
    return [];
  } catch (error) {
    console.error("Gagal mengambil foto dari ArcGIS:", error);
    return [];
  }
}

// 4. KOMPONEN ANAK
const FilterPelanggan = ({ initialFilters, onApplyFilters, isFetching }: { initialFilters: PelangganFilters; onApplyFilters: (filters: PelangganFilters) => void; isFetching: boolean; }) => {
  const [localFilters, setLocalFilters] = useState(initialFilters);
  const handleApply = () => onApplyFilters(localFilters);
  const handleReset = () => {
    const cleared = { idpel: "", kwh: "", statusDil: "", namaGardu: "" };
    setLocalFilters(cleared);
    onApplyFilters(cleared);
  };
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-5 p-4 border rounded-lg bg-gray-50">
      <Input placeholder="Cari ID Pelanggan..." name="idpel" value={localFilters.idpel} onChange={(e) => setLocalFilters(p => ({ ...p, idpel: e.target.value }))} />
      <Input placeholder="Cari No KWH..." name="kwh" value={localFilters.kwh} onChange={(e) => setLocalFilters(p => ({ ...p, kwh: e.target.value }))} />
      <Input placeholder="Cari Nama Gardu..." name="namaGardu" value={localFilters.namaGardu} onChange={(e) => setLocalFilters(p => ({ ...p, namaGardu: e.target.value }))} />
      <select name="statusDil" value={localFilters.statusDil} onChange={(e) => setLocalFilters(p => ({ ...p, statusDil: e.target.value }))} className="w-full p-2 border rounded-md bg-white text-sm h-10">
        <option value="">Semua Status</option>
        {statusDilOptions.map((o) => (<option key={o} value={o}>{o.replace(/_/g, " ")}</option>))}
      </select>
      <div className="flex items-end space-x-2">
        <Button onClick={handleApply} className="w-full bg-sky-500 hover:bg-sky-400" disabled={isFetching}><Search className="mr-2 h-4 w-4" /> {isFetching ? 'Mencari...' : 'Cari'}</Button>
        <Button variant="outline" onClick={handleReset} className="w-full" disabled={isFetching}><RotateCcw className="mr-2 h-4 w-4" /> Reset</Button>
      </div>
    </div>
  );
};


// Komponen Input
interface DataFieldProps {
  id: keyof Omit<ValidasiPelanggan, 'photo_url'>;
  label: string;
  value?: string | number | null;
  isEditing: boolean;
  type?: 'text' | 'select' | 'textarea' | 'readonly';
  options?: string[];
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  className?: string;
}

const DataField = ({ id, label, value, isEditing, type = 'text', options = [], onChange, className = '' }: DataFieldProps) => {
  const commonClasses = "mt-1 w-full rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 p-2 text-sm";
  if (!isEditing || type === 'readonly') {
    return (
      <div className={className}>
        <Label className="text-xs text-slate-500 dark:text-slate-400">{label}</Label>
        <p className={`font-semibold text-slate-800 dark:text-slate-200 text-sm mt-1 truncate p-2 rounded-md ${type === 'readonly' ? 'bg-slate-100 dark:bg-slate-800' : ''}`}>
          {value || "-"}
        </p>
      </div>
    );
  }
  return (
    <div className={className}>
      <Label htmlFor={id} className="text-xs text-slate-600 dark:text-slate-400">{label}</Label>
      {type === 'select' ? (
        <select id={id} name={id} value={value || ""} onChange={onChange} className={commonClasses}>
          <option value="">-- Pilih --</option>
          {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
        </select>
      ) : type === 'textarea' ? (
        <textarea id={id} name={id} value={value || ""} onChange={onChange as any} className={commonClasses} rows={3} />
      ) : (
        <Input id={id} name={id} value={value || ""} onChange={onChange} className={commonClasses} />
      )}
    </div>
  );
};


// 4. KOMPONEN MODALVALIDASI
const ModalValidasi = ({ pelanggan, onClose, onSave }: {
  pelanggan: ValidasiPelanggan | null;
  onClose: () => void;
  onSave: (updatedData: ValidasiPelanggan) => void;
}) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [formData, setFormData] = useState<Partial<ValidasiPelanggan> | null>(null);
  const [saving, setSaving] = useState(false);
  const [photoUrls, setPhotoUrls] = useState<string[]>([]);
  const [loadingPhoto, setLoadingPhoto] = useState(false);
  const [zoomImage, setZoomImage] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    if (!pelanggan) return;

    console.log("=== Data Pelanggan Diterima ===", pelanggan);

    setFormData(pelanggan);
    setIsEditMode(false);
    setLoadingPhoto(true);

    let urls: string[] = [];

    if (pelanggan.photos && pelanggan.photos.length > 0) {
      urls = pelanggan.photos
        .filter((p: any) => p.status === "available" && p.converted) // ambil hanya yang available
        .map((p: any) => p.converted);

      console.log("=== PhotoUrls (setelah filter status available) ===", urls);
    } else {
      console.log("=== Tidak ada foto tersedia ===");
    }

    setPhotoUrls(urls);
    setLoadingPhoto(false);
  }, [pelanggan]);



  if (!pelanggan) return null;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => (prev ? { ...prev, [name]: value } : null));
  };

  const handleSaveChanges = async () => {
    if (!formData || !formData.idpel) return;
    setSaving(true);
    try {
      await apiService.put(`validasi-pelanggan/${formData.idpel}`, formData);
      onSave(formData as ValidasiPelanggan);
      toast.success("Data berhasil diperbarui!");
      onClose();
    } catch (err) {
      toast.error("Gagal menyimpan perubahan.");
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const PhotoCarousel = ({ imageUrls }: { imageUrls: string[] }) => {
    if (!imageUrls || imageUrls.length === 0) {
      return (<div className="w-full aspect-square bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center text-slate-500"> Tidak ada foto </div>);
    }
    const nextPhoto = () => setCurrentImageIndex((prev) => (prev + 1) % imageUrls.length);
    const prevPhoto = () => setCurrentImageIndex((prev) => (prev === 0 ? imageUrls.length - 1 : prev - 1));
    return (
      <div className="relative w-full aspect-square group">
        <div className="absolute inset-0 bg-black/5 rounded-lg overflow-hidden">
          <img src={imageUrls[currentImageIndex]} alt={`Foto Pelanggan ${currentImageIndex + 1}`} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 cursor-zoom-in" onClick={() => setZoomImage(imageUrls[currentImageIndex])} />
          <ZoomableImage src={imageUrls[currentImageIndex]} />
        </div>
        {imageUrls.length > 1 && (
          <>
            <button onClick={prevPhoto} className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/30 text-white p-2 rounded-full hover:bg-black/60 transition-all opacity-0 group-hover:opacity-100"><ChevronLeft size={20} /></button>
            <button onClick={nextPhoto} className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/30 text-white p-2 rounded-full hover:bg-black/60 transition-all opacity-0 group-hover:opacity-100"><ChevronRight size={20} /></button>
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex space-x-2">
              {imageUrls.map((_, index) => (<span key={index} onClick={() => setCurrentImageIndex(index)} className={`h-2 w-2 rounded-full cursor-pointer transition-all ${index === currentImageIndex ? "bg-white scale-125" : "bg-white/50"}`} />))}
            </div>
          </>
        )}
      </div>
    );
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 flex justify-center items-center p-4 transition-opacity duration-300" onClick={onClose}>
        <div className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl w-full max-w-6xl z-50 flex flex-col max-h-[95vh]" onClick={(e) => e.stopPropagation()}>
          <div className="flex justify-between items-center p-4 border-b border-slate-200 dark:border-slate-800 flex-shrink-0">
            <div className="flex items-center space-x-3">
              <UserCheck className="text-blue-500" size={24} />
              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">{isEditMode ? "Edit Data Pelanggan" : "Detail Validasi Pelanggan"}</h3>
            </div>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-600"><XCircle size={24} /></button>
          </div>
          <div className="p-6 flex-grow overflow-y-auto">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-4">
                {loadingPhoto ? <div className="w-full aspect-square bg-slate-200 rounded-lg animate-pulse"></div> : <PhotoCarousel imageUrls={photoUrls} />}
              </div>
              <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                <DataField id="idpel" label="ID PELANGGAN" value={formData?.idpel} isEditing={isEditMode} type="readonly" onChange={handleInputChange} />
                <DataField id="no_seri_kwh" label="NO. SERI KWH METER" value={formData?.kwh} isEditing={isEditMode} onChange={handleInputChange} />
                <DataField id="status_dil" label="STATUS DIL" value={formData?.status_dil} isEditing={isEditMode} type="select" options={statusDilModalOptions} onChange={handleInputChange} />
                {/* <DataField
                  id="usergambar"
                  label="NAMA SURVEYOR"
                  value={formData?.usergambar ?? ""}
                  isEditing={isEditMode}
                  onChange={handleInputChange}
                  disabled
                /> */}
                <DataField id="KODE_GARDU" label="KODE GARDU" value={formData?.KODE_GARDU} isEditing={isEditMode} onChange={handleInputChange} />
                <DataField id="merk_kwh_meter" label="MERK KWH METER" value={formData?.merk_kwh_meter} isEditing={isEditMode} type="select" options={merkKwhMeterOptions} onChange={handleInputChange} />
                <DataField id="tahun_buat_kwh" label="TAHUN BUAT KWH" value={formData?.tahun_buat_kwh} isEditing={isEditMode} onChange={handleInputChange} />
                <DataField id="jenis_kwh_meter" label="JENIS KWH METER" value={formData?.jenis_kwh_meter} isEditing={isEditMode} type="select" options={jenisKwhMeterOptions} onChange={handleInputChange} />
                <DataField id="fasa_jaringan" label="FASA JARINGAN" value={formData?.fasa_jaringan} isEditing={isEditMode} type="select" options={fasaJaringanOptions} onChange={handleInputChange} />
                <DataField id="mcb_ampere" label="MCB AMPERE" value={formData?.mcb_ampere} isEditing={isEditMode} type="select" options={mcbAmpereOptions} onChange={handleInputChange} />
                <DataField id="mcb_fasa" label="MCB FASA" value={formData?.mcb_fasa} isEditing={isEditMode} type="select" options={mcbFasaOptions} onChange={handleInputChange} />
                <DataField id="DAYA" label="DAYA" value={formData?.DAYA} isEditing={isEditMode} onChange={handleInputChange} />
                <DataField id="MERK_PEMBATAS" label="MERK PEMBATAS" value={formData?.MERK_PEMBATAS} isEditing={isEditMode} type="select" options={merkPembatasOptions} onChange={handleInputChange} />
                <DataField id="JENIS_PEMBATAS" label="JENIS PEMBATAS" value={formData?.JENIS_PEMBATAS} isEditing={isEditMode} type="select" options={jenisPembatasOptions} onChange={handleInputChange} />
                <DataField id="statusValidasi" label="VALIDASI" value={formData?.statusValidasi} isEditing={isEditMode} type="select" options={validasiOptions} onChange={handleInputChange} />
                <DataField id="keterangan" label="KETERANGAN" value={formData?.keterangan} isEditing={isEditMode} type="select" options={keteranganOptions} onChange={handleInputChange} /* className="md:col-span-2"  */ />
              </div>
            </div>
          </div>
          <div className="flex justify-end space-x-3 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-b-xl flex-shrink-0">
            {isEditMode ? (
              <>
                <Button variant="outline" onClick={() => { setIsEditMode(false); setFormData(pelanggan); }}><XCircle className="mr-2 h-4 w-4" /> Batal</Button>
                <Button onClick={handleSaveChanges} disabled={saving} className="bg-blue-600 hover:bg-blue-700 text-white">{saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}{saving ? "Menyimpan..." : "Simpan Perubahan"}</Button>
              </>
            ) : (
              <>
                <Button variant="secondary" onClick={() => setIsEditMode(true)}><Edit className="mr-2 h-4 w-4" /> Edit</Button>
                <Button onClick={onClose} className="bg-slate-800 dark:bg-slate-200 text-white dark:text-black hover:bg-slate-700 dark:hover:bg-slate-300"><CheckCircle className="mr-2 h-4 w-4" /> OK</Button>
              </>
            )}
          </div>
        </div>
      </div>
      {zoomImage && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center"
          onClick={() => setZoomImage(null)}
        >
          <div className="relative max-w-5xl w-full p-6">
            <ZoomableImage src={zoomImage} />
            <button
              className="absolute -top-2 -right-2 text-white bg-black/60 p-2 rounded-full hover:bg-black/80 transition-all"
              onClick={() => setZoomImage(null)}
            >
              X
            </button>
          </div>
        </div>
      )}
    </>
  );
};


// 5. KOMPONEN DATA TABLE
const CustomDataTable = ({ columns, data }: { columns: ColumnDef<ValidasiPelanggan>[]; data: ValidasiPelanggan[]; }) => {
  if (data.length === 0) {
    return (<div className="flex items-center justify-center p-10 text-center"><p className="text-gray-500 dark:text-gray-400">Tidak ada data yang ditemukan.</p></div>);
  }
  return (
    <div className="w-full overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-800">
          <tr>
            {columns.map((columnDef, index) => (
              <th key={(columnDef as any).id || (columnDef as any).accessorKey || index} scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                {typeof columnDef.header === "function" ? columnDef.header({} as any) : columnDef.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
          {data.map((row, rowIndex) => (
            <tr key={row.idpel || rowIndex} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors duration-150">
              {columns.map((columnDef, colIndex) => {
                const rowPropForCell = { index: rowIndex, original: row, getValue: (key: string) => row[key as keyof ValidasiPelanggan] || row[(columnDef as any).accessorKey as keyof ValidasiPelanggan], };
                let cellContent;
                if (typeof columnDef.cell === 'function') {
                  cellContent = columnDef.cell({ row: rowPropForCell } as any);
                } else {
                  cellContent = row[(columnDef as any).accessorKey as keyof ValidasiPelanggan];
                }
                return (<td key={(columnDef as any).id || (columnDef as any).accessorKey || colIndex} className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200"> {cellContent ?? "—"} </td>);
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// 6. CUSTOM HOOK
const usePelangganData = () => {
  const [data, setData] = useState<ValidasiPelanggan[]>([]);
  const [summary, setSummary] = useState<SummaryData>({ totalPelanggan: 0, totalDil: 0, tidakDil: 0, dikunci: 0, belumLengkap: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loadingSummary, setLoadingSummary] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(100);
  const [nextPage, setNextPage] = useState<number | null>(null);
  const [prevPage, setPrevPage] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState<string>("idpel");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [filters, setFilters] = useState<PelangganFilters>({ idpel: "", kwh: "", statusDil: "", namaGardu: "" });
  const isInitialMount = useRef(true);
  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({ page: currentPage.toString(), per_page: perPage.toString(), sort_by: sortBy, sort_dir: sortDir });
      Object.entries(filters).forEach(([key, value]) => { if (value) params.append(key, value); });
      const response = await apiService.get<ValidasiPelanggan>(`validasi-pelanggan?${params.toString()}`) as PagePaginatedResponse<ValidasiPelanggan>;
      setData(response?.data ?? []);
      setNextPage(response.next_page);
      setPrevPage(response.prev_page);
      if (response.current_page) { setCurrentPage(response.current_page); }
    } catch (err: any) {
      setError(err.message || "Gagal mengambil data pelanggan.");
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [currentPage, perPage, sortBy, sortDir, filters]);
  const fetchSummary = useCallback(async () => {
    setLoadingSummary(true);
    try {
      const response = await apiService.get<SummaryData>("validasi-pelanggan/summary") as unknown as SummaryData;
      setSummary(response);
    } catch (error) { console.error("Error fetching summary data:", error); }
    finally { setLoadingSummary(false); }
  }, []);
  useEffect(() => {
    if (process.env.NODE_ENV === 'development' && isInitialMount.current) { isInitialMount.current = false; return; }
    const handler = setTimeout(() => { fetchData(); }, 500);
    return () => { clearTimeout(handler); };
  }, [fetchData]);
  useEffect(() => { fetchSummary(); }, [fetchSummary]);
  const handleSort = (column: string) => {
    if (sortBy === column) { setSortDir(prev => prev === "asc" ? "desc" : "asc"); } else { setSortBy(column); setSortDir("asc"); }
    setCurrentPage(1);
  };
  const applyFilters = (newFilters: PelangganFilters) => { setFilters(newFilters); setCurrentPage(1); };
  const updatePelangganInList = (updatedPelanggan: ValidasiPelanggan) => {
    setData(prev => prev.map(item => item.idpel === updatedPelanggan.idpel ? { ...item, ...updatedPelanggan } : item));
    fetchSummary();
  };
  return { data, summary, loading, error, loadingSummary, pagination: { currentPage, perPage, setPerPage: (num: number) => { setPerPage(num); setCurrentPage(1); }, handleNextPage: () => { if (nextPage) setCurrentPage(nextPage); }, handlePrevPage: () => { if (prevPage) setCurrentPage(prevPage); }, nextPage, prevPage }, sorting: { sortBy, sortDir, handleSort }, filters, applyFilters, updatePelangganInList, };
};

// 7. KOMPONEN UTAMA
interface ZoomableImageProps {
  src: string;
}

const ZoomableImage = ({ src }: ZoomableImageProps) => {
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });

  const handleWheel = (e: React.WheelEvent<HTMLImageElement>) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    setScale(prev => Math.min(Math.max(prev + delta, 1), 6));
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLImageElement>) => {
    e.preventDefault();
    setDragging(true);
    setStartPos({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLImageElement>) => {
    if (!dragging) return;
    setPosition({ x: e.clientX - startPos.x, y: e.clientY - startPos.y });
  };

  const handleMouseUp = () => setDragging(false);
  const handleMouseLeave = () => setDragging(false);

  return (
    <img
      src={src}
      alt="Foto Pelanggan Diperbesar"
      className="w-full h-auto max-h-[90vh] object-contain rounded-lg shadow-2xl cursor-grab"
      style={{
        transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
        transition: dragging ? 'none' : 'transform 0.1s ease-out',
      }}
      onWheel={handleWheel}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
    />
  );
};


export default function ValidasiPelangganPage() {
  const { data, summary, loading, error, loadingSummary, pagination, sorting, filters, applyFilters, updatePelangganInList } = usePelangganData();
  const [selectedPelanggan, setSelectedPelanggan] = useState<ValidasiPelanggan | null>(null);
  const columns = useMemo<ColumnDef<ValidasiPelanggan>[]>(() => [
    { id: "no", header: "No", cell: ({ row }) => { const pageIndex = pagination.currentPage - 1; const pageSize = pagination.perPage; return pageIndex * pageSize + row.index + 1; } },
    { accessorKey: "idpel", header: () => <button onClick={() => sorting.handleSort("idpel")} className="font-semibold flex items-center">ID Pelanggan {sorting.sortBy === "idpel" && (sorting.sortDir === "asc" ? '▲' : '▼')}</button>, },
    { accessorKey: "kwh", header: "No KWH" },
    { accessorKey: "statusDil", header: "Status DIL", cell: ({ row }) => { const status = (row.original.statusDil as string) || "N/A"; const style = statusStyles[status] || "bg-gray-100 text-gray-800"; return <span className={`px-2 py-1 text-xs font-semibold rounded-full ${style}`}>{status.replace(/_/g, " ")}</span>; }, },
    { accessorKey: "namaGardu", header: "Nama Gardu" },
    { id: "aksi", header: () => <div className="text-center">Aksi</div>, cell: ({ row }) => <div className="text-center"><Button variant="outline" size="sm" onClick={() => setSelectedPelanggan(row.original)}>Validasi</Button></div> }
  ], [sorting.sortBy, sorting.sortDir, sorting.handleSort, pagination.currentPage, pagination.perPage]);

  return (
    <SidebarProvider className="font-poppins">
      <AppSidebar className="w-[200px]" />
      <SidebarInset className="bg-white">
        <Toaster richColors position="top-right" />
        <Header />
        {summary && (
          <div className="flex flex-wrap gap-2 justify-center my-4">
            <CardTotal total={(summary.totalPelanggan ?? 0).toLocaleString('id-ID')} description="Total Pelanggan" textColor="text-green-600" />
            <CardTotal total={(summary.totalDil ?? 0).toLocaleString('id-ID')} description="Total DIL" />
            <CardTotal total={(summary.tidakDil ?? 0).toLocaleString('id-ID')} description="Tidak DIL" />
            <CardTotal total={(summary.dikunci ?? 0).toLocaleString('id-ID')} description="Dikunci" />
            <CardTotal total={(summary.belumLengkap ?? 0).toLocaleString('id-ID')} textColor="text-red-600" description="Belum Lengkap" />
          </div>
        )}
        <main className="bg-white border border-gray-200 shadow-sm rounded-lg p-4 mx-5 my-5">
          <h2 className="text-lg font-semibold mb-4">Data Pelanggan</h2>
          <FilterPelanggan initialFilters={filters} onApplyFilters={applyFilters} isFetching={loading} />
          <div className="mt-5 border rounded-md overflow-hidden">
            {loading && data.length === 0 ? <p className="text-center p-8 text-gray-500">Memuat data...</p>
              : error ? <p className="text-red-600 text-center p-8">{error}</p>
                : <CustomDataTable columns={columns} data={data} />}
          </div>
          {!loading && !error && (
            <div className="flex flex-col sm:flex-row items-center justify-between space-y-2 sm:space-y-0 sm:space-x-4 py-4">
              <p className="text-sm text-gray-600"> Halaman <strong>{pagination.currentPage}</strong>. Menampilkan <strong>{data.length}</strong> baris. </p>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={pagination.handlePrevPage} disabled={!pagination.prevPage || loading}> <FaChevronLeft className="w-4 h-4" /> <span className="sr-only">Previous</span> </Button>
                <Button variant="outline" size="sm" onClick={pagination.handleNextPage} disabled={!pagination.nextPage || loading}> <FaChevronRight className="w-4 h-4" /> <span className="sr-only">Next</span> </Button>
              </div>
            </div>
          )}
        </main>
        {selectedPelanggan && (
          <ModalValidasi
            pelanggan={selectedPelanggan}
            onClose={() => setSelectedPelanggan(null)}
            onSave={updatePelangganInList}
          />
        )}
      </SidebarInset>
    </SidebarProvider>
  );
}