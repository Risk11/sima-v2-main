"use client";

import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Edit, Save, XCircle, UserCheck, Loader2 } from "lucide-react";
import apiService from "@/services/api-services";
import { ValidasiPelanggan } from "@/types/data";
import { motion } from "framer-motion";

interface ModalValidasiProps {
    pelanggan: ValidasiPelanggan | null;
    onClose: () => void;
    onSave: (updatedData: ValidasiPelanggan) => void;
}

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

const DataField = ({
    id,
    label,
    value,
    isEditing,
    type = 'input',
    options,
    onChange
}: {
    id: string;
    label: string;
    value: string | null;
    isEditing: boolean;
    type?: string;
    options?: string[];
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}) => {
    return (
        <div className="flex flex-col space-y-1">
            <Label htmlFor={id} className="text-xs text-slate-500 font-medium">{label}</Label>
            {isEditing ? (
                type === 'select' ? (
                    <select
                        id={id}
                        name={id}
                        value={value || ""}
                        onChange={onChange}
                        className="font-semibold w-full p-2 rounded-md bg-white border border-slate-200"
                    >
                        <option value="">Pilih...</option>
                        {options?.map(option => (
                            <option key={option} value={option}>{option}</option>
                        ))}
                    </select>
                ) : (
                    <Input
                        id={id}
                        name={id}
                        type={type === 'number' ? 'text' : 'text'}
                        inputMode={type === 'number' ? 'numeric' : undefined}
                        pattern={type === 'number' ? '[0-9]*' : undefined}
                        value={value || ""}
                        onChange={(e) => {
                            if (type === 'number') {
                                e.target.value = e.target.value.replace(/[^0-9]/g, "");
                            }
                            onChange(e);
                        }}
                        className="font-semibold"
                    />
                )
            ) : (
                <div className="w-full p-2 rounded-md bg-slate-50 text-sm font-medium border border-slate-200">
                    {value || "-"}
                </div>
            )}
        </div>
    );
};

const ModalValidasi = ({ pelanggan, onClose, onSave }: ModalValidasiProps) => {
    const [isEditMode, setIsEditMode] = useState(false);
    const [formData, setFormData] = useState<ValidasiPelanggan | null>(null);
    const [saving, setSaving] = useState(false);
    const [zoomedPhoto, setZoomedPhoto] = useState<number | null>(null);
    const [zoomScale, setZoomScale] = useState(1);
    const [panPosition, setPanPosition] = useState({ x: 0, y: 0 });
    const [isPanning, setIsPanning] = useState(false);
    const panStartPos = useRef({ x: 0, y: 0 });
    const photoRefs = useRef<Array<HTMLDivElement | null>>([]);

    useEffect(() => {
        if (pelanggan) {
            const rawPhotos = (pelanggan as any).PHOTOS || (pelanggan as any).photos || "";
            const photosArray = Array.isArray(rawPhotos)
                ? rawPhotos
                : rawPhotos.split(',').filter((url: string) => url.trim() !== '');

            setFormData({
                ...pelanggan,
                photos: photosArray,
            });
        }
    }, [pelanggan]);

    useEffect(() => {
        setZoomScale(1);
        setPanPosition({ x: 0, y: 0 });
    }, [zoomedPhoto]);

    if (!pelanggan || !formData || !formData.photos) {
        return null;
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => (prev ? { ...prev, [name]: value } : null));
    };

    const handleSaveChanges = async () => {
        if (!formData?.idpel) {
            toast.error("ID Pelanggan tidak valid.");
            return;
        }
        setSaving(true);
        try {
            await apiService.put(`validasi/${formData.idpel}`, formData);
            onSave(formData);
            toast.success("Data berhasil diperbarui! 🎉");
            onClose();
        } catch (err) {
            toast.error("Gagal menyimpan perubahan. 😥");
            console.error(err);
        } finally {
            setSaving(false);
        }
    };

    const handleToggleZoom = (index: number) => {
        if (zoomedPhoto === index) {
            setZoomedPhoto(null);
        } else {
            setZoomedPhoto(index);
        }
    };

    const handleZoom = (event: React.WheelEvent) => {
        event.stopPropagation();
        const delta = event.deltaY > 0 ? -0.1 : 0.1;
        setZoomScale(prevScale => {
            const newScale = prevScale + delta;
            return Math.max(1, Math.min(3, newScale));
        });
    };

    const handlePanStart = (e: React.MouseEvent) => {
        if (zoomScale > 1) {
            e.preventDefault();
            setIsPanning(true);
            panStartPos.current = {
                x: e.clientX - panPosition.x,
                y: e.clientY - panPosition.y
            };
        }
    };

    const handlePanMove = (e: React.MouseEvent) => {
        if (!isPanning) return;
        setPanPosition({
            x: e.clientX - panStartPos.current.x,
            y: e.clientY - panStartPos.current.y
        });
    };

    const handlePanEnd = () => {
        setIsPanning(false);
    };

    const DataSection = ({ title, children }: { title: string; children: React.ReactNode }) => (
        <div className="space-y-4">
            <h4 className="font-semibold text-base text-blue-600 border-b pb-2">{title}</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {children}
            </div>
        </div>
    );

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 flex justify-center items-center p-4 overflow-y-auto" onClick={onClose}>
            <motion.div
                initial={{ y: "100%", opacity: 0 }}
                animate={{ y: "0%", opacity: 1 }}
                exit={{ y: "100%", opacity: 0 }}
                transition={{ type: "spring", damping: 25, stiffness: 500 }}
                className="bg-white rounded-xl shadow-2xl w-full max-w-4xl z-50 flex flex-col max-h-[90vh]"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex justify-between items-center p-6 border-b">
                    <div className="flex items-center space-x-3">
                        <UserCheck size={24} className="text-blue-600" />
                        <h3 className="text-xl font-bold">
                            {isEditMode ? "Edit Data Pelanggan" : "Detail Validasi Pelanggan"}
                        </h3>
                    </div>
                    <Button variant="ghost" size="icon" onClick={onClose} className="text-gray-500 hover:text-gray-700">
                        <XCircle size={24} />
                    </Button>
                </div>

                <div className="p-6 overflow-y-auto space-y-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div className="space-y-4">
                            <h4 className="font-semibold text-base text-blue-600 border-b pb-2">Foto Survei</h4>
                            <div className="grid grid-cols-1 gap-4">
                                {formData.photos.length > 0 ? (
                                    formData.photos.map((photo, index) => (
                                        <div
                                            key={index}
                                            ref={(el) => (photoRefs.current[index] = el)}
                                            className={`relative aspect-[3/4] rounded-lg overflow-hidden shadow-lg transition-all duration-300 transform-gpu ${zoomedPhoto === index ? 'z-20 border-4 border-blue-500' : 'hover:scale-105'}`}
                                            onClick={() => handleToggleZoom(index)}
                                            onWheel={zoomedPhoto === index ? handleZoom : undefined}
                                            onMouseDown={zoomedPhoto === index ? handlePanStart : undefined}
                                            onMouseMove={zoomedPhoto === index ? handlePanMove : undefined}
                                            onMouseUp={zoomedPhoto === index ? handlePanEnd : undefined}
                                            onMouseLeave={zoomedPhoto === index ? handlePanEnd : undefined}
                                        >
                                            <img
                                                src={photo}
                                                alt={`Foto ${index + 1}`}
                                                className={`w-full h-full object-contain bg-slate-100 transition-transform duration-300 ${zoomedPhoto === index ? (zoomScale > 1 ? 'cursor-grabbing' : 'cursor-grab') : 'cursor-pointer'}`}
                                                style={{ transform: `scale(${zoomScale}) translate(${panPosition.x / zoomScale}px, ${panPosition.y / zoomScale}px)` }}
                                            />
                                        </div>
                                    ))
                                ) : (
                                    <div className="col-span-1 text-center py-10 bg-gray-50 rounded-lg text-gray-500">
                                        <p>Tidak ada foto ditemukan.</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="space-y-6">
                            <DataSection title="Informasi Pelanggan">
                                <DataField id="idpel" label="ID PELANGGAN" value={formData.idpel} isEditing={isEditMode} onChange={handleInputChange} />
                                <DataField id="nomor_meter_kwh" label="NO KWH" value={formData.nomor_meter_kwh} isEditing={isEditMode} onChange={handleInputChange} />
                                <DataField id="kode_gardu" label="KODE GARDU" value={formData.kode_gardu} isEditing={false} onChange={handleInputChange} />
                                <DataField id="nama_project" label="NAMA PROJECT" value={formData.nama_project} isEditing={false} onChange={handleInputChange} />
                                <DataField id="tanggal" label="TANGGAL SURVEI" value={formData.tanggal} isEditing={false} onChange={handleInputChange} />
                                <DataField id="nama_surveyor" label="NAMA SURVEYOR" value={formData.nama_surveyor} isEditing={false} onChange={handleInputChange} />
                            </DataSection>

                            <DataSection title="Status Validasi">
                                <DataField id="status_dil" label="STATUS DIL" value={formData.status_dil} isEditing={isEditMode} type="select" options={statusDilModalOptions} onChange={handleInputChange} />
                                <DataField id="validasi" label="KETERANGAN VALIDASI" value={formData.validasi} isEditing={isEditMode} type="select" options={validasiOptions} onChange={handleInputChange} />
                            </DataSection>

                            <DataSection title="Lainnya">
                                <DataField id="MERK_KWH" label="MERK KWH METER" value={formData?.MERK_KWH} isEditing={isEditMode} type="select" options={merkKwhMeterOptions} onChange={handleInputChange} />
                                <DataField id="TAHUN_BUAT" label="TAHUN BUAT KWH" value={formData?.TAHUN_BUAT} isEditing={isEditMode} onChange={handleInputChange} />
                                <DataField id="kwh_katap" label="JENIS KWH METER" value={formData?.kwh_katap} isEditing={isEditMode} type="select" options={jenisKwhMeterOptions} onChange={handleInputChange} />
                                <DataField id="kwh_fasa_jaringan" label="FASA JARINGAN" value={formData?.kwh_fasa_jaringan} isEditing={isEditMode} type="select" options={fasaJaringanOptions} onChange={handleInputChange} />
                                <DataField id="mcb_ampere" label="MCB AMPERE" value={formData?.mcb_ampere} isEditing={isEditMode} type="select" options={mcbAmpereOptions} onChange={handleInputChange} />
                                <DataField id="mcb_fasa" label="MCB FASA" value={formData?.mcb_fasa} isEditing={isEditMode} type="select" options={mcbFasaOptions} onChange={handleInputChange} />
                                <DataField id="DAYA" label="DAYA" value={formData?.DAYA} isEditing={isEditMode} type="number" onChange={handleInputChange} />
                                <DataField id="MERK_PEMBATAS" label="MERK PEMBATAS" value={formData?.MERK_PEMBATAS} isEditing={isEditMode} type="select" options={merkPembatasOptions} onChange={handleInputChange} />
                                <DataField id="JENIS_PEMBATAS" label="JENIS PEMBATAS" value={formData?.JENIS_PEMBATAS} isEditing={isEditMode} type="select" options={jenisPembatasOptions} onChange={handleInputChange} />
                                <DataField id="keterangan" label="KETERANGAN" value={formData?.keterangan} isEditing={isEditMode} type="select" options={keteranganOptions} onChange={handleInputChange} />
                            </DataSection>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end p-4 bg-gray-50 rounded-b-xl border-t">
                    <div className="flex space-x-3">
                        {isEditMode ? (
                            <>
                                <Button variant="outline" onClick={() => setIsEditMode(false)}>
                                    <XCircle className="mr-2 h-4 w-4" /> Batal
                                </Button>
                                <Button onClick={handleSaveChanges} disabled={saving}>
                                    {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />} Simpan
                                </Button>
                            </>
                        ) : (
                            <Button onClick={() => setIsEditMode(true)}>
                                <Edit className="mr-2 h-4 w-4" /> Edit
                            </Button>
                        )}
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default ModalValidasi;