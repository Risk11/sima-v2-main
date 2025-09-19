"use client";

import { useState, useEffect, useMemo } from "react";

interface PhotoCarouselProps {
    photoStr: string;
}

interface FeatureItem {
    id: number;
    name: string;
    graphic: any;
    layerId: string;
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
}

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

const PhotoCarousel = ({ photoStr }: PhotoCarouselProps) => {
    const imageUrls = photoStr
        .split(",")
        .map(u => u.trim())
        .filter(u => u !== "" && (u.startsWith("http") || u.startsWith("file://")));

    const [currentImage, setCurrentImage] = useState(0);

    const handlePrev = () =>
        setCurrentImage(prev => (prev - 1 + imageUrls.length) % imageUrls.length);
    const handleNext = () =>
        setCurrentImage(prev => (prev + 1) % imageUrls.length);

    if (imageUrls.length === 0) {
        return <p className="italic text-gray-500 text-center text-sm">Tidak ada foto tersedia. 📸</p>;
    }

    return (
        <div className="w-full pt-2">
            <h4 className="text-sm font-semibold text-gray-400 mb-2">Foto</h4>
            <div className="relative w-full rounded-xl overflow-hidden shadow-sm border border-gray-700">
                <img
                    key={currentImage}
                    src={imageUrls[currentImage]}
                    alt={`Foto ${currentImage + 1}`}
                    className="w-full h-auto max-h-[160px] object-cover bg-gray-800 transition-all duration-300 ease-in-out"
                    onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        if (!target.dataset.fallback) {
                            target.src = "https://via.placeholder.com/250x160/2D3748/A0AEC0?text=Foto+Gagal+Dimuat";
                            target.dataset.fallback = "true";
                        }
                    }}
                />
                {imageUrls.length > 1 && (
                    <div className="absolute inset-0 flex items-center justify-between px-2">
                        <button
                            onClick={handlePrev}
                            className="bg-gray-900/40 text-gray-100 p-2 rounded-full hover:bg-gray-900/60 transition-colors"
                        >
                            <ChevronLeftIcon />
                        </button>
                        <button
                            onClick={handleNext}
                            className="bg-gray-900/40 text-gray-100 p-2 rounded-full hover:bg-gray-900/60 transition-colors"
                        >
                            <ChevronRightIcon />
                        </button>
                    </div>
                )}
                {imageUrls.length > 1 && (
                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-gray-900/60 text-gray-100 text-xs font-medium px-2 py-1 rounded-full">
                        <span>{currentImage + 1} / {imageUrls.length}</span>
                    </div>
                )}
            </div>
        </div>
    );
};

const layerConfigs: LayerConfig[] = [
    { id: "0", title: "Gardu", url: "https://dms.duniacommunica.co.id/gispro3/rest/services/PLN_PERBAIKAN_NUNUKAN/MapServer/0", nameField: "NAMA_GARDU", photoField: "FOTO_LINK" },
    { id: "1", title: "Pelanggan", url: "https://dms.duniacommunica.co.id/gispro3/rest/services/PLN_PERBAIKAN_NUNUKAN/MapServer/1", nameField: "ID_PELANGGAN", photoField: "PHOTO" },
    { id: "2", title: "Tiang", url: "https://dms.duniacommunica.co.id/gispro3/rest/services/PLN_PERBAIKAN_NUNUKAN/MapServer/2", nameField: "ID_TIANG", photoField: "PHOTO" },
    { id: "3", title: "SR", url: "https://dms.duniacommunica.co.id/gispro3/rest/services/PLN_PERBAIKAN_NUNUKAN/MapServer/3", nameField: "KODE_TIANG_TR" },
    { id: "4", title: "JTR", url: "https://dms.duniacommunica.co.id/gispro3/rest/services/PLN_PERBAIKAN_NUNUKAN/MapServer/4", nameField: "ID_JTR" },
];

const renderValue = (key: string, value: any) => {
    if (value === null || value === undefined) return <span className="text-gray-500 italic">N/A</span>;
    if (typeof value === "object") return JSON.stringify(value);
    return value.toString();
};

const renderPhotoCarousel = (attrs: any, cfg: LayerConfig) => {
    if (!attrs) return null;

    const photos = [cfg.photoField, "FOTO_LINK", "PHOTOS", "Picture", "PATH_LOCAL", "PATH_LOCAL2"]
        .map((k) => (k ? attrs[k] : null))
        .filter((v) => v && v !== "" && v !== "N/A");
    if (photos.length === 0) return null;
    return <PhotoCarousel photoStr={photos.join(",")} />;
};


interface FeatureCardProps {
    feature: FeatureItem;
    cfg: LayerConfig | undefined;
    isExpanded: boolean;
    isSelected: boolean;
    onClick: () => void;
}
const FeatureCard = ({ feature, cfg, isExpanded, isSelected, onClick }: FeatureCardProps) => {
    return (
        <div className={`mb-4 rounded-xl shadow-lg border transition-all duration-300 ${isSelected ? "bg-gray-700 border-sky-400" : "bg-gray-800 border-gray-700 hover:bg-gray-700 hover:scale-[1.01] hover:shadow-xl"}`}>
            <button
                className="w-full p-4 flex justify-between items-center text-left focus:outline-none rounded-xl"
                onClick={onClick}
            >
                <div>
                    <span className="font-semibold text-gray-50 text-base">{feature.name}</span>
                    <span className="block text-xs text-gray-400 mt-0.5">{cfg?.title}</span>
                </div>
                <span className={`text-sky-400 transition-transform duration-300 transform ${isExpanded ? "rotate-180" : "rotate-0"}`}>
                    <ArrowDownIcon />
                </span>
            </button>

            {isExpanded && (
                <div className="p-4 bg-gray-800 text-gray-300 text-sm rounded-b-xl border-t border-gray-700">
                    {renderPhotoCarousel(feature.graphic.attributes, cfg!)}
                    <h4 className="text-sm font-semibold text-gray-400 mt-4 mb-2">Detail Atribut</h4>

                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-700">
                            <thead className="bg-gray-700">
                                <tr>
                                    <th scope="col" className="px-4 py-2 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                                        Field
                                    </th>
                                    <th scope="col" className="px-4 py-2 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                                        Value
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-gray-800 divide-y divide-gray-700">
                                {Object.entries(feature.graphic.attributes)
                                    .filter(([key]) =>
                                        key !== "OBJECTID" &&
                                        !["PHOTOS", "Picture", "PATH_LOCAL", "PATH_LOCAL2", "FOTO_LINK", "PHOTO"].includes(key)
                                    )
                                    .map(([key, value]) => (
                                        <tr key={key} className="hover:bg-gray-700 transition-colors">
                                            <td className="px-4 py-2 whitespace-nowrap text-xs font-medium text-gray-100">
                                                {key}
                                            </td>
                                            <td className="px-4 py-2 text-sm text-gray-300 break-words">
                                                {renderValue(key, value)}
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
    const [expandedFeatureId, setExpandedFeatureId] = useState<number | null>(null);

    useEffect(() => {
        const fetchAllFeatures = async () => {
            setLoading(true);
            let allFeatures: FeatureItem[] = [];

            const [{ default: FeatureLayer }, { default: GraphicsLayer }, geometryEngine] =
                await Promise.all([
                    import("@arcgis/core/layers/FeatureLayer"),
                    import("@arcgis/core/layers/GraphicsLayer"),
                    import("@arcgis/core/geometry/geometryEngine"),
                ]);


            for (const cfg of layerConfigs) {
                try {
                    const layer = new FeatureLayer({ url: cfg.url });
                    await layer.load();

                    const queryResult = await layer.queryFeatures({
                        where: "1=1",
                        outFields: ["*"],
                        returnGeometry: true,
                    });

                    const fetched = queryResult.features.map((f: any) => ({
                        id: f.attributes.OBJECTID,
                        name: f.attributes[cfg.nameField] || `Feature ${f.attributes.OBJECTID}`,
                        graphic: f,
                        layerId: cfg.id,
                    }));

                    allFeatures = [...allFeatures, ...fetched];
                } catch (err) {
                    console.error(`Gagal memuat lapisan ${cfg.title}`, err);
                }
            }
            setFeatures(allFeatures);
            setLoading(false);
        };
        fetchAllFeatures();
    }, []);

    useEffect(() => {
        if (initialSelectedLayer !== undefined) {
            setSelectedLayer(initialSelectedLayer);
        }
    }, [initialSelectedLayer]);

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
        return features.filter(
            f =>
                (selectedLayer ? f.layerId === selectedLayer : true) &&
                f.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [features, selectedLayer, searchTerm]);

    const toggleExpand = (id: number) => {
        setExpandedFeatureId(prevId => (prevId === id ? null : id));
    };

    return (
        <div className="p-6 flex flex-col h-full bg-gray-900 text-gray-100">
            <div className="mb-6">
                <h1 className="text-1xl font-bold text-gray-50">List Of Surveyed Substations</h1>
                {/* <p className="text-sm text-gray-400 mt-1">Jelajahi aset geografis dengan mudah.</p> */}
            </div>

            <div className="space-y-3 mb-6">
                <div className="flex items-center space-x-2">
                    <button
                        onClick={() => handleLayerChange('prev')}
                        className="p-2 rounded-lg bg-gray-800 border border-gray-700 hover:bg-gray-700 transition-colors"
                    >
                        <ChevronLeftIcon />
                    </button>
                    <div className="relative flex-1">
                        <select
                            value={selectedLayer ?? ""}
                            onChange={e => setSelectedLayer(e.target.value || null)}
                            className="w-full p-3 rounded-lg border border-gray-700 text-gray-100 bg-gray-800 focus:outline-none focus:ring-2 focus:ring-sky-400 appearance-none pr-8 transition-all duration-200"
                        >
                            <option value="" className="bg-gray-800">All Layers</option>
                            {layerConfigs.map(l => (
                                <option key={l.id} value={l.id} className="bg-gray-800">{l.title}</option>
                            ))}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
                            <ArrowDownIcon />
                        </div>
                    </div>
                    <button
                        onClick={() => handleLayerChange('next')}
                        className="p-2 rounded-lg bg-gray-800 border border-gray-700 hover:bg-gray-700 transition-colors"
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
                        placeholder="Cari fitur..."
                        className="w-full p-3 rounded-lg border border-gray-700 text-gray-100 bg-gray-800 focus:outline-none focus:ring-2 focus:ring-sky-400 transition-all duration-200 pl-10"
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="flex-1 overflow-y-auto pr-2">
                {loading && (
                    <div className="flex flex-col items-center justify-center h-full text-gray-500">
                        <svg className="animate-spin h-8 w-8 text-sky-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <div className="mt-4 text-sm italic">Memuat fitur...</div>
                    </div>
                )}

                {!loading && filteredFeatures.length === 0 && (
                    <div className="text-gray-500 text-sm text-center py-4">
                        <span role="img" aria-label="magnifying glass" className="block text-2xl mb-2">🔍😔</span>
                        Tidak ada fitur yang ditemukan.
                    </div>
                )}

                {!loading &&
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
                            />
                        );
                    })}
            </div>
        </div>
    );
}