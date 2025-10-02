"use client";
import { useState, useMemo } from 'react';
import Graphic from "@arcgis/core/Graphic";
import { ChevronDownIcon } from 'lucide-react';
import PhotoCarousel from './PhotoCarousel';

type EditableAttributes = {
    IDPEL?: string;
    ALAMAT?: string;
    NOKWH?: string;
    DAYA?: string;
    STATUS_DIL?: string;
    VALIDASI?: string;
};

interface DuplicateCardProps {
    idpel: string;
    features: Graphic[];
    isExpanded: boolean;
    onClick: () => void;
    onSave: (objectId: number, updatedAttributes: EditableAttributes) => Promise<boolean>;
    onFeatureClick: (feature: Graphic) => void;
    activeFeatureId: number | null;
}

const statusDilOptions = ["Cek Database Data Dil", "DIL WEB", "VERIFIKASI", "DIL", "DIL_IDPEL", "DIL_NOKWH", "NO_DIL", "DIKUNCI", "NK"];
const validasiOptions = ["SUDAH VALID", "BELUM VALIDASI", "IDPEL DUPLIKASI", "FOTO REJECT", "VERIFIKASI", "LAINNYA"];

const isImageFileUrl = (url: string): boolean => {
    return /\.(jpg|jpeg|png|gif|webp|bmp|svg)$/i.test(url);
};


function EditableFeatureForm({
    feature,
    onSave,
    onClick,
    isActive
}: {
    feature: Graphic;
    onSave: (objectId: number, updatedAttributes: EditableAttributes) => Promise<boolean>;
    onClick: () => void;
    isActive: boolean;
}) {
    const objectId = feature.attributes.OBJECTID;
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [formData, setFormData] = useState<EditableAttributes>({
        IDPEL: feature.attributes.IDPEL || "",
        ALAMAT: feature.attributes.ALAMAT || "",
        NOKWH: feature.attributes.NOKWH || "",
        DAYA: feature.attributes.DAYA || "",
        STATUS_DIL: feature.attributes.STATUS_DIL || "",
        VALIDASI: feature.attributes.VALIDASI || ""
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = async (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsSaving(true);
        setError(null);
        const success = await onSave(objectId, formData);
        if (!success) {
            setError("Gagal menyimpan data. Silakan coba lagi.");
        }
        setIsSaving(false);
    };

    const imageUrls = useMemo(() => {
        const urls: string[] = [];
        const attributes = feature.attributes;

        if (attributes.PHOTOS) {
            const photoUrlString = String(attributes.PHOTOS);
            photoUrlString.split(',').forEach(urlPart => {
                const trimmedUrl = urlPart.trim();
                if (trimmedUrl) {
                    if (trimmedUrl.startsWith('http')) {
                        urls.push(trimmedUrl);
                    }
                }
            });
        }
        for (const fieldName in attributes) {
            const value = attributes[fieldName];
            if (typeof value === 'string' && (value.startsWith('http://') || value.startsWith('https://')) && isImageFileUrl(value)) {
                if (!urls.includes(value)) {
                    urls.push(value);
                }
            }
        }
        return Array.from(new Set(urls)).filter(Boolean);
    }, [feature.attributes]);

    const editableFields: (keyof EditableAttributes)[] = ["IDPEL", "ALAMAT", "NOKWH", "DAYA", "STATUS_DIL", "VALIDASI"];
    const activeClass = isActive ? 'border-2 border-purple-500 shadow-md' : 'border border-slate-200';

    return (
        <div
            className={`bg-slate-50 rounded-md p-4 mt-2 cursor-pointer transition-all duration-200 ${activeClass}`}
            onClick={onClick}
        >
            <h4 className="font-semibold text-gray-700 mb-2">OBJECTID: {objectId}</h4>

            {imageUrls.length > 0 && (
                <div className="mb-4">
                    <PhotoCarousel imageUrls={imageUrls} />
                </div>
            )}

            <div className="space-y-3">
                {editableFields.map(field => (
                    <div key={field}>
                        <label className="text-xs font-medium text-gray-500 block mb-1">{field.replace(/_/g, ' ')}</label>

                        {field === 'STATUS_DIL' ? (
                            <select
                                name={field}
                                value={formData[field]}
                                onChange={handleChange}
                                className="w-full p-2 text-sm rounded-md border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            >
                                {statusDilOptions.map(option => (
                                    <option key={option} value={option}>{option}</option>
                                ))}
                            </select>
                        ) : field === 'VALIDASI' ? (
                            <select
                                name={field}
                                value={formData[field]}
                                onChange={handleChange}
                                className="w-full p-2 text-sm rounded-md border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            >
                                {validasiOptions.map(option => (
                                    <option key={option} value={option}>{option}</option>
                                ))}
                            </select>
                        ) : (
                            <input
                                type={field === 'DAYA' ? 'number' : 'text'}
                                name={field}
                                value={formData[field]}
                                onChange={handleChange}
                                className="w-full p-2 text-sm rounded-md border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                min={field === 'DAYA' ? 0 : undefined}
                            />
                        )}
                    </div>
                ))}
            </div>
            <button
                onClick={handleSave}
                disabled={isSaving}
                className="mt-4 w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 disabled:bg-indigo-300 transition-colors"
            >
                {isSaving ? "Menyimpan..." : "Simpan Perubahan"}
            </button>
            {error && <p className="text-red-500 text-xs mt-2 text-center">{error}</p>}
        </div>
    );
}

export default function DuplicateCard({ idpel, features, isExpanded, onClick, onSave, onFeatureClick, activeFeatureId }: DuplicateCardProps) {
    return (
        <div className="bg-white border border-slate-200 rounded-lg mb-2 transition-all duration-300">
            <div
                onClick={onClick}
                className="p-3 flex justify-between items-center cursor-pointer hover:bg-slate-50"
            >
                <div>
                    <p className="font-bold text-gray-800">{idpel}</p>
                    <p className="text-sm text-blue-600">Ditemukan {features.length} kali</p>
                </div>
                <ChevronDownIcon className={`w-5 h-5 text-gray-500 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
            </div>

            {isExpanded && (
                <div className="p-3 border-t border-slate-200">
                    <p className="text-sm font-semibold mb-2 text-gray-600">Pilih detail untuk menyorot titik spesifik:</p>
                    <div className="space-y-4">
                        {features.map(feature => {
                            const objectId = feature.attributes.OBJECTID;
                            return (
                                <EditableFeatureForm
                                    key={objectId}
                                    feature={feature}
                                    onSave={onSave}
                                    onClick={() => onFeatureClick(feature)}
                                    isActive={activeFeatureId === objectId}
                                />
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}