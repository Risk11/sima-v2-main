"use client";

import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import FeatureLayer from "@arcgis/core/layers/FeatureLayer";
import Graphic from "@arcgis/core/Graphic";
import FeatureCard from "./FeatureCard";
import { FeatureItem } from "../../types";
import { ChevronLeftIcon, ChevronRightIcon, ArrowDownIcon, SearchIcon, SpinnerIcon, XCircleIcon } from "../ui/icons";
import { useActiveLayerConfigs } from "../arcgis/hooks/useActiveLayerConfigs";

function useDebounce<T>(value: T, delay: number): T {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);
    useEffect(() => {
        const handler = setTimeout(() => { setDebouncedValue(value); }, delay);
        return () => { clearTimeout(handler); };
    }, [value, delay]);
    return debouncedValue;
}

const StatusDisplay = ({ icon, message }: { icon: React.ReactNode, message: string }) => (
    <div className="flex flex-col items-center justify-center h-full text-center text-gray-500 px-4">
        <div className="text-4xl mb-3">{icon}</div>
        <p className="text-sm">{message}</p>
    </div>
);

interface LayerListProps {
    onFeatureSelect: (feature: Graphic | null, layerId: string | null) => void;
    selectedFeature?: Graphic | null;
}

export default function LayerList({ onFeatureSelect, selectedFeature }: LayerListProps) {
    const activeLayerConfigs = useActiveLayerConfigs();

    const [layerFeatures, setLayerFeatures] = useState<Record<string, FeatureItem[]>>({});
    const [selectedLayerId, setSelectedLayerId] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [expandedFeatureId, setExpandedFeatureId] = useState<number | null>(null);
    const [pagination, setPagination] = useState<Record<string, { start: number, hasMore: boolean }>>({});

    const debouncedSearchTerm = useDebounce(searchTerm, 500);

    const featureCardRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
    const abortControllerRef = useRef<AbortController | null>(null);

    const fetchFeaturesByLayer = useCallback(async (layerId: string, isLoadMore = false) => {
        if (abortControllerRef.current) abortControllerRef.current.abort();
        const controller = new AbortController();
        abortControllerRef.current = controller;

        setLoading(true);
        setError(null);

        const cfg = activeLayerConfigs.find(l => l.id === layerId);
        if (!cfg) {
            setError("Konfigurasi layer tidak ditemukan.");
            setLoading(false);
            return;
        }

        const start = isLoadMore ? (pagination[layerId]?.start || 0) : 0;

        try {
            const layer = new FeatureLayer({ url: cfg.url });
            const query = layer.createQuery();
            query.where = debouncedSearchTerm.trim() ? `${cfg.nameField} LIKE '%${debouncedSearchTerm.trim()}%'` : "1=1";
            query.outFields = ["*"];
            query.returnGeometry = true;
            query.start = start;
            query.num = 50;

            const queryResult = await layer.queryFeatures(query, { signal: controller.signal });
            const newFeatures = queryResult.features.map((f: any) => ({
                id: f.attributes.OBJECTID,
                name: f.attributes[cfg.nameField] || `Feature ${f.attributes.OBJECTID}`,
                graphic: f,
                layerId: cfg.id,
            }));

            setLayerFeatures(prev => ({ ...prev, [layerId]: isLoadMore ? [...(prev[layerId] || []), ...newFeatures] : newFeatures }));
            setPagination(prev => ({ ...prev, [layerId]: { start: start + newFeatures.length, hasMore: queryResult.exceededTransferLimit === true } }));
        } catch (err: any) {
            if (err.name !== 'AbortError') setError("Gagal memuat data fitur.");
        } finally {
            setLoading(false);
        }
    }, [activeLayerConfigs, debouncedSearchTerm, pagination]);

    useEffect(() => {
        if (activeLayerConfigs.length > 0) {
            const isCurrentLayerValid = activeLayerConfigs.some(l => l.id === selectedLayerId);
            if (!isCurrentLayerValid) {
                setSelectedLayerId(activeLayerConfigs[0].id);
            }
        } else {
            setSelectedLayerId(null);
        }
    }, [activeLayerConfigs, selectedLayerId]);

    useEffect(() => {
        if (selectedLayerId) {
            setLayerFeatures(prev => ({ ...prev, [selectedLayerId]: [] }));
            setPagination(prev => ({ ...prev, [selectedLayerId]: { start: 0, hasMore: true } }));
            fetchFeaturesByLayer(selectedLayerId, false);
        }

    }, [selectedLayerId, debouncedSearchTerm]);

    useEffect(() => {
        if (selectedFeature) {
            const objectId = selectedFeature.attributes.OBJECTID;
            const featureLayer = selectedFeature.layer as FeatureLayer;
            const config = activeLayerConfigs.find(c => c.id === featureLayer.id);
            if (config) {
                if (config.id !== selectedLayerId) setSelectedLayerId(config.id);
                setExpandedFeatureId(objectId);
                setTimeout(() => { featureCardRefs.current[`${config.id}-${objectId}`]?.scrollIntoView({ behavior: 'smooth', block: 'center' }); }, 300);
            }
        } else {
            setExpandedFeatureId(null);
        }
    }, [selectedFeature, selectedLayerId, activeLayerConfigs]);

    const currentFeatures = useMemo(() => selectedLayerId ? layerFeatures[selectedLayerId] || [] : [], [layerFeatures, selectedLayerId]);

    const handleLayerChange = useCallback((direction: 'next' | 'prev') => {
        const currentIndex = activeLayerConfigs.findIndex(l => l.id === selectedLayerId);
        if (currentIndex === -1) return;
        const newIndex = (currentIndex + (direction === 'next' ? 1 : -1) + activeLayerConfigs.length) % activeLayerConfigs.length;
        setSelectedLayerId(activeLayerConfigs[newIndex].id);
    }, [selectedLayerId, activeLayerConfigs]);

    const handleToggleExpand = useCallback((feature: FeatureItem) => {
        const newExpandedId = expandedFeatureId === feature.id ? null : feature.id;
        setExpandedFeatureId(newExpandedId);
        onFeatureSelect(newExpandedId ? feature.graphic : null, newExpandedId ? feature.layerId : null);
    }, [expandedFeatureId, onFeatureSelect]);

    const totalFeatures = currentFeatures.length;
    const currentPagination = selectedLayerId ? pagination[selectedLayerId] : null;

    return (
        <div className="flex flex-col h-full bg-slate-100 text-gray-800">
            <div className="p-4 border-b border-slate-200">
                <h1 className="text-xl font-bold text-gray-800">List Of Substations</h1>
            </div>

            <div className="p-4 space-y-3 bg-white border-b border-slate-200">
                <div className="flex items-center space-x-2">
                    <button onClick={() => handleLayerChange('prev')} disabled={activeLayerConfigs.length < 2} className="p-2 rounded-md border bg-white hover:bg-slate-100 transition-colors disabled:opacity-50"><ChevronLeftIcon /></button>
                    <div className="relative flex-1">
                        <select
                            value={selectedLayerId ?? ""}
                            onChange={e => setSelectedLayerId(e.target.value)}
                            className="w-full p-2 rounded-md border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none pr-8"
                        >
                            {activeLayerConfigs.map(l => <option key={l.id} value={l.id}>{l.title}</option>)}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500"><ArrowDownIcon /></div>
                    </div>
                    <button onClick={() => handleLayerChange('next')} disabled={activeLayerConfigs.length < 2} className="p-2 rounded-md border bg-white hover:bg-slate-100 transition-colors disabled:opacity-50"><ChevronRightIcon /></button>
                </div>
                <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400"><SearchIcon /></div>
                    <input
                        type="text"
                        placeholder="Cari fitur..."
                        className="w-full p-2 rounded-md border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 pl-10 pr-10"
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                    />
                    {searchTerm && <button onClick={() => setSearchTerm("")} className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"><XCircleIcon /></button>}
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
                {loading && totalFeatures === 0 && <StatusDisplay icon={<SpinnerIcon />} message="Memuat fitur..." />}
                {error && <StatusDisplay icon="❌" message={error} />}
                {!loading && !error && currentFeatures.length === 0 && (
                    <StatusDisplay icon="🔍" message={debouncedSearchTerm ? "Fitur tidak ditemukan." : "Tidak ada fitur pada layer ini."} />
                )}
                {!error && currentFeatures.map(f => {
                    const cfg = activeLayerConfigs.find(l => l.id === f.layerId);
                    return (
                        <FeatureCard
                            key={`${f.layerId}-${f.id}`}
                            feature={f}
                            cfg={cfg}
                            isExpanded={expandedFeatureId === f.id}
                            isSelected={!!(selectedFeature && f.graphic.attributes.OBJECTID === selectedFeature.attributes.OBJECTID)}
                            onClick={() => handleToggleExpand(f)}
                            cardRef={el => { if (el) featureCardRefs.current[`${f.layerId}-${f.id}`] = el; }}
                        />
                    );
                })}
                {currentPagination?.hasMore && !loading && (
                    <button
                        onClick={() => fetchFeaturesByLayer(selectedLayerId!, true)}
                        className="w-full mt-4 p-2 rounded-md bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold"
                    >
                        Muat Lebih Banyak
                    </button>
                )}
                {loading && totalFeatures > 0 && <StatusDisplay icon={<SpinnerIcon />} message="Memuat..." />}
            </div>

            {!loading && !error && totalFeatures > 0 && (
                <div className="p-3 text-center text-xs text-gray-500 border-t border-slate-200 bg-white">
                    Menampilkan <strong>{totalFeatures}</strong> fitur {debouncedSearchTerm && `(hasil pencarian)`}
                </div>
            )}
        </div>
    );
}