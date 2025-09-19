"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import FeatureLayer from "@arcgis/core/layers/FeatureLayer";
import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer";

interface PhotoCarouselProps {
    imageUrls: string[];
}

interface FeatureItem {
    id: number;
    name: string;
    graphic: any;
    layerId: string;
}
interface FeatureCardProps {
    feature: FeatureItem;
    cfg: LayerConfig | undefined;
    isExpanded: boolean;
    isSelected: boolean;
    onClick: () => void;
    cardRef: React.Ref<HTMLDivElement>;
}


interface LayerListProps {
    onFeatureSelect: (feature: any | null) => void;
    selectedFeature?: any | null;
    initialSelectedLayer?: string | null;
}

interface LayerConfig {
    id: string;
    title: string;
    url: string;
    nameField: string;
    photoField?: string;
    displayFields: string[];
}

const layerConfigs: LayerConfig[] = [
    {
        id: "0",
        title: "Gardu",
        url: "https://dms.duniacommunica.co.id/gispro3/rest/services/PLN_PERBAIKAN_NUNUKAN/MapServer/0",
        nameField: "NAMA_GARDU",
        photoField: "FOTO_LINK",
        displayFields: ["OBJECTID", "NAMA_GARDU", "JALAN", "JENIS", "PENYULANG", "KAPASITAS"]
    },
    {
        id: "1",
        title: "Pelanggan",
        url: "https://dms.duniacommunica.co.id/gispro3/rest/services/PLN_PERBAIKAN_NUNUKAN/MapServer/1",
        nameField: "ID_PELANGGAN",
        photoField: "PHOTOS",
        displayFields: [
            "OBJECTID", "IDPELANGGAN", "status_kepemilikan", "mcb_ampere",
            "mcb_fasa", "DAYA", "ASSETTYPE", "MERK_PEMBATAS",
            "JENIS_PEMBATAS", "VALIDASI", "KODE_GARDU",
        ]
    },
    {
        id: "2",
        title: "Tiang",
        url: "https://dms.duniacommunica.co.id/gispro3/rest/services/PLN_PERBAIKAN_NUNUKAN/MapServer/2",
        nameField: "ID_TIANG",
        photoField: "PHOTO",
        displayFields: [
            "OBJECTID", "KODE_TIANG_TR", "TANGGAL", "status", "jenis_tiang",
            "status_kepemilikan", "ukuran_tiang", "city", "latitudey",
            "longitudey", "KODE_GARDU", "VALIDASI",
        ]
    },
    {
        id: "3",
        title: "SR",
        url: "https://dms.duniacommunica.co.id/gispro3/rest/services/PLN_PERBAIKAN_NUNUKAN/MapServer/3",
        nameField: "KODE_TIANG_TR",
        displayFields: [
            "OBJECTID", "status", "VALIDASI", "KODE_TIANG_TR", "KODE_GARDU",
            "IDPEL", "PANJANG_HANTARAN", "KODE", "KODE_PELANGGAN"
        ]
    },
    {
        id: "4",
        title: "JTR",
        url: "https://dms.duniacommunica.co.id/gispro3/rest/services/PLN_PERBAIKAN_NUNUKAN/MapServer/4",
        nameField: "ID_JTR",
        displayFields: [
            "OBJECTID", "bahan_kawat", "jenis_kabel", "status_kepemilikan",
            "ukuran_kawat", "posisi_fasa", "status", "kode_hantaran", "hantaran_netral",
            "fasa_jaringan", "jenis_konduktor", "panjang_hantaran", "KODE_GARDU",
            "TIANG_TR_AWAL", "TIANG_TR_AKHIR", "KODEJURUSAN", "VALIDASI", "ID_JTR"
        ]
    }
];

const ChevronLeftIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
    </svg>
);
const ChevronRightIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
    </svg>
);
const ArrowDownIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
    </svg>
);
const SearchIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5 text-gray-400">
        <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
    </svg>
);

const PhotoCarousel = ({ imageUrls }: PhotoCarouselProps) => {
    const [currentImage, setCurrentImage] = useState(0);

    useEffect(() => {
        setCurrentImage(0);
    }, [imageUrls]);

    const handlePrev = () =>
        setCurrentImage(prev => (prev - 1 + imageUrls.length) % imageUrls.length);
    const handleNext = () =>
        setCurrentImage(prev => (prev + 1) % imageUrls.length);

    if (imageUrls.length === 0) {
        return <p className="italic text-gray-600 text-center text-sm">Tidak ada foto tersedia. 📸</p>;
    }

    return (
        <div className="w-full pt-2">
            <h4 className="text-sm font-semibold text-gray-500 mb-2">Foto</h4>
            <div className="relative w-full rounded-xl overflow-hidden shadow-sm border border-slate-300">
                <img
                    key={currentImage}
                    src={imageUrls[currentImage]}
                    alt={`Foto ${currentImage + 1}`}
                    className="w-full h-auto max-h-[160px] object-cover bg-gray-200 transition-all duration-300 ease-in-out"
                    onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        if (!target.dataset.fallback) {
                            target.src = "https://via.placeholder.com/250x160/E2E8F0/4A5568?text=Foto+Gagal+Dimuat";
                            target.dataset.fallback = "true";
                        }
                    }}
                />
                {imageUrls.length > 1 && (
                    <div className="absolute inset-0 flex items-center justify-between px-2">
                        <button
                            onClick={handlePrev}
                            className="bg-white/40 text-gray-800 p-2 rounded-full hover:bg-white/60 transition-colors"
                        >
                            <ChevronLeftIcon />
                        </button>
                        <button
                            onClick={handleNext}
                            className="bg-white/40 text-gray-800 p-2 rounded-full hover:bg-white/60 transition-colors"
                        >
                            <ChevronRightIcon />
                        </button>
                    </div>
                )}
                {imageUrls.length > 1 && (
                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-gray-800/60 text-white text-xs font-medium px-2 py-1 rounded-full">
                        <span>{currentImage + 1} / {imageUrls.length}</span>
                    </div>
                )}
            </div>
        </div>
    );
};

const FeatureCard = ({ feature, cfg, isExpanded, isSelected, onClick, cardRef }: FeatureCardProps) => {
    const attributesToShow = useMemo(() => {
        if (!cfg) return [];
        return cfg.displayFields.filter(key =>
            key !== "SHAPE" && key !== "Shape" && key !== "OBJECTID" &&
            !["PHOTOS", "Picture", "FOTO_LINK", "PHOTO", "PATH_LOCAL", "PATH_LOCAL2"].includes(key)
        );
    }, [cfg]);

    const renderValue = (key: string, value: any) => {
        if (value === null || value === undefined) return <span className="text-gray-500 italic">N/A</span>;
        if (typeof value === "object") return JSON.stringify(value);
        return value.toString();
    };

    const renderPhotoCarousel = (attrs: any, cfg: LayerConfig) => {
        if (!attrs) return null;

        const photoFields = [cfg.photoField, "FOTO_LINK", "PHOTOS", "Picture", "PATH_LOCAL", "PATH_LOCAL2"];
        let allUrls: string[] = [];

        photoFields.forEach(field => {
            if (field && attrs[field]) {
                const urls = String(attrs[field]).split(',').map(u => u.trim()).filter(Boolean);
                allUrls.push(...urls);
            }
        });

        const validUrls = allUrls.filter(u => u.startsWith("http") || u.startsWith("file://"));

        if (validUrls.length === 0) return null;

        return <PhotoCarousel imageUrls={validUrls} />;
    };


    return (
        <div ref={cardRef} className={`mb-4 rounded-xl shadow-lg border transition-all duration-300 ${isSelected ? "bg-indigo-50 border-indigo-500" : "bg-white border-slate-300 hover:bg-indigo-50 hover:scale-[1.01] hover:shadow-xl"}`}>
            <button
                className="w-full p-4 flex justify-between items-center text-left focus:outline-none rounded-xl"
                onClick={onClick}
            >
                <div>
                    <span className="font-semibold text-gray-800 text-base">{feature.name}</span>
                    <span className="block text-xs text-gray-600 mt-0.5">{cfg?.title}</span>
                </div>
                <span className={`text-indigo-500 transition-transform duration-300 transform ${isExpanded ? "rotate-180" : "rotate-0"}`}>
                    <ArrowDownIcon />
                </span>
            </button>

            {isExpanded && (
                <div className="p-4 bg-gray-50 text-gray-700 text-sm rounded-b-xl border-t border-slate-300">
                    {renderPhotoCarousel(feature.graphic.attributes, cfg!)}
                    <h4 className="text-sm font-semibold text-gray-600 mt-4 mb-2">Detail Atribut</h4>

                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-slate-300">
                            <thead className="bg-slate-200">
                                <tr>
                                    <th scope="col" className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        Field
                                    </th>
                                    <th scope="col" className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        Value
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-slate-200">
                                {attributesToShow.map((key) => (
                                    <tr key={key} className="hover:bg-slate-100 transition-colors">
                                        <td className="px-4 py-2 whitespace-nowrap text-xs font-medium text-gray-800">
                                            {key}
                                        </td>
                                        <td className="px-4 py-2 text-sm text-gray-700 break-words">
                                            {renderValue(key, feature.graphic.attributes[key])}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default function LayerList({ onFeatureSelect, selectedFeature, initialSelectedLayer }: LayerListProps) {
    const [features, setFeatures] = useState<FeatureItem[]>([]);
    const [selectedLayer, setSelectedLayer] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [expandedFeatureId, setExpandedFeatureId] = useState<number | null>(null);
    const featureCardRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

    useEffect(() => {
        const fetchAllFeatures = async () => {
            setLoading(true);
            setError(null);
            try {
                const promises = layerConfigs.map(async (cfg) => {
                    const layer = new FeatureLayer({ url: cfg.url });
                    const queryResult = await layer.queryFeatures({
                        where: "1=1",
                        outFields: ["*"],
                        returnGeometry: true,
                    });
                    return queryResult.features.map((f: any) => ({
                        id: f.attributes.OBJECTID,
                        name: f.attributes[cfg.nameField] || `Feature ${f.attributes.OBJECTID}`,
                        graphic: f,
                        layerId: cfg.id,
                    }));
                });

                const results = await Promise.all(promises);
                const allFeatures = results.flat();
                setFeatures(allFeatures);

            } catch (err) {
                console.error("Gagal memuat satu atau lebih lapisan.", err);
                setError("Gagal memuat data. Silakan coba lagi nanti.");
            } finally {
                setLoading(false);
            }
        };
        fetchAllFeatures();
    }, []);

    useEffect(() => {
        if (initialSelectedLayer && initialSelectedLayer !== selectedLayer) {
            setSelectedLayer(initialSelectedLayer);
            setSearchTerm("");
        }
    }, [initialSelectedLayer, selectedLayer]);

    useEffect(() => {
        if (selectedFeature) {
            const objectId = selectedFeature.attributes.OBJECTID;
            setExpandedFeatureId(objectId);
            setTimeout(() => {
                const featureCardRef = featureCardRefs.current[`${selectedFeature.layer?.id}-${objectId}`];
                if (featureCardRef) {
                    featureCardRef.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            }, 100);
        } else {
            setExpandedFeatureId(null);
        }
    }, [selectedFeature, features]);

    const handleLayerChange = (direction: 'next' | 'prev') => {
        const currentIndex = layerConfigs.findIndex(l => l.id === selectedLayer);
        let newIndex = 0;
        if (selectedLayer === null || currentIndex === -1) {
            newIndex = direction === 'next' ? 0 : layerConfigs.length - 1;
        } else {
            newIndex = (currentIndex + (direction === 'next' ? 1 : -1) + layerConfigs.length) % layerConfigs.length;
        }
        setSelectedLayer(layerConfigs[newIndex].id);
        setSearchTerm("");
    };

    const filteredFeatures = useMemo(() => {
        const lowerCaseSearchTerm = searchTerm.toLowerCase().trim();

        if (!lowerCaseSearchTerm) {
            return features.filter(f => (selectedLayer ? f.layerId === selectedLayer : true));
        }

        return features.filter(f => {
            const layerMatch = selectedLayer ? f.layerId === selectedLayer : true;
            if (!layerMatch) return false;

            const cfg = layerConfigs.find(l => l.id === f.layerId);
            if (!cfg) return false;

            return cfg.displayFields.some(field => {
                const value = f.graphic.attributes[field];
                return value && value.toString().toLowerCase().includes(lowerCaseSearchTerm);
            });
        });
    }, [features, selectedLayer, searchTerm]);

    const toggleExpand = (id: number) => {
        setExpandedFeatureId(prevId => (prevId === id ? null : id));
    };

    return (
        <div className="p-6 flex flex-col h-full bg-slate-100 text-gray-800">
            <div className="mb-6">
                <h1 className="text-xl font-bold text-gray-800">List Of Surveyed Substations</h1>
            </div>

            <div className="space-y-3 mb-6">
                <div className="flex items-center space-x-2">
                    <button
                        onClick={() => handleLayerChange('prev')}
                        className="p-2 rounded-lg bg-white border border-slate-300 hover:bg-slate-200 transition-colors text-gray-700"
                    >
                        <ChevronLeftIcon />
                    </button>
                    <div className="relative flex-1">
                        <select
                            value={selectedLayer ?? ""}
                            onChange={e => setSelectedLayer(e.target.value || null)}
                            className="w-full p-3 rounded-lg border border-slate-300 text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none pr-8 transition-all duration-200"
                        >
                            <option value="" className="bg-white">All Layer</option>
                            {layerConfigs.map(l => (
                                <option key={l.id} value={l.id} className="bg-white">{l.title}</option>
                            ))}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                            <ArrowDownIcon />
                        </div>
                    </div>
                    <button
                        onClick={() => handleLayerChange('next')}
                        className="p-2 rounded-lg bg-white border border-slate-300 hover:bg-slate-200 transition-colors text-gray-700"
                    >
                        <ChevronRightIcon />
                    </button>
                </div>
                <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                        <SearchIcon />
                    </div>
                    <input
                        type="text"
                        placeholder="Cari fitur yang anda ingin lihat.."
                        className="w-full p-3 rounded-lg border border-slate-300 text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200 pl-10"
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="flex-1 overflow-y-auto pr-2">
                {loading && (
                    <div className="flex flex-col items-center justify-center h-full text-gray-500">
                        <svg className="animate-spin h-8 w-8 text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <div className="mt-4 text-sm italic">Memuat fitur...</div>
                    </div>
                )}

                {error && (
                    <div className="text-red-500 text-sm text-center py-4">
                        <span role="img" aria-label="cross mark" className="block text-2xl mb-2">❌</span>
                        {error}
                    </div>
                )}

                {!loading && !error && filteredFeatures.length === 0 && (
                    <div className="text-gray-500 text-sm text-center py-4">
                        <span role="img" aria-label="magnifying glass" className="block text-2xl mb-2">🔍😔</span>
                        Tidak ada fitur yang ditemukan.
                    </div>
                )}

                {!loading && !error &&
                    filteredFeatures.map(f => {
                        const cfg = layerConfigs.find(l => l.id === f.layerId);
                        const isExpanded = expandedFeatureId === f.id;
                        const isSelected = f.graphic && selectedFeature && f.graphic.attributes.OBJECTID === selectedFeature.attributes.OBJECTID;

                        return (
                            <FeatureCard
                                key={`${f.layerId}-${f.id}`}
                                feature={f}
                                cfg={cfg}
                                isExpanded={isExpanded}
                                isSelected={isSelected}
                                onClick={() => {
                                    if (f.graphic && (!selectedFeature || f.graphic.attributes.OBJECTID !== selectedFeature.attributes.OBJECTID)) {
                                        onFeatureSelect(f.graphic);

                                    }
                                    toggleExpand(f.id);
                                }}
                                cardRef={el => {
                                    if (el) {
                                        featureCardRefs.current[`${f.layerId}-${f.id}`] = el;
                                    }
                                }}
                            />
                        );
                    })}
            </div>
        </div>
    );
}