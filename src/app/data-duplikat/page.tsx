"use client";

import { useState, useCallback, useEffect } from "react";
import PetaArcGISSDK from "./PetaArcGISSDK";
import DuplicateList, { DuplicateGroup } from "./DuplicateList";
import Graphic from "@arcgis/core/Graphic";
import FeatureLayer from "@arcgis/core/layers/FeatureLayer";
import axios from 'axios';

import { useActiveLayerConfigs } from "@/components/arcgis/hooks/useActiveLayerConfigs";
import { useArcGis } from "@/components/arcgis/context/ArcGisProvider";

const MenuIcon = () => (
    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
    </svg>
);

export default function DataDuplicatePage() {
    const activeLayerConfigs = useActiveLayerConfigs();
    const { selectedService } = useArcGis();

    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [duplicateData, setDuplicateData] = useState<DuplicateGroup[]>([]);
    const [featuresToHighlight, setFeaturesToHighlight] = useState<Graphic[] | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeFeatureId, setActiveFeatureId] = useState<number | null>(null);

    const findDuplicateIdpels = useCallback(async () => {
        if (!selectedService) return;

        console.log("Layer yang tersedia:", activeLayerConfigs);
        setLoading(true);
        setError(null);
        setDuplicateData([]);

        const pelangganConfig = activeLayerConfigs.find(cfg => {
            const titleLower = cfg.title.toLowerCase();
            return titleLower === "pelanggan" || titleLower === "peralatandipelanggan";
        });
        if (!pelangganConfig) {
            setError("Layer 'Pelanggan' tidak ditemukan di service ini.");
            setLoading(false);
            return;
        }

        try {
            const layer = new FeatureLayer({ url: pelangganConfig.url });
            const queryResult = await layer.queryFeatures({
                where: "1=1",
                outFields: ["*"],
                returnGeometry: true,
            });

            const featuresByIdpel = new Map<string, Graphic[]>();
            for (const feature of queryResult.features) {
                const idpel = feature.attributes.IDPEL;
                if (idpel) {
                    if (!featuresByIdpel.has(idpel)) {
                        featuresByIdpel.set(idpel, []);
                    }
                    featuresByIdpel.get(idpel)?.push(feature);
                }
            }

            const duplicates: DuplicateGroup[] = [];
            featuresByIdpel.forEach((features, idpel) => {
                if (features.length > 1) {
                    duplicates.push({ idpel, features, count: features.length });
                }
            });
            setDuplicateData(duplicates);

        } catch (err: any) {
            console.error("Gagal mengambil data duplikat:", err);
            setError("Terjadi kesalahan saat memuat data.");
        } finally {
            setLoading(false);
        }
    }, [selectedService, activeLayerConfigs]);

    useEffect(() => {
        findDuplicateIdpels();
    }, [findDuplicateIdpels]);

    const handleSelectDuplicateGroup = useCallback((_idpel: string | null, features: Graphic[] | null) => {
        setFeaturesToHighlight(features);
        setActiveFeatureId(null);
        if (features && window.innerWidth < 768) {
            setIsSidebarOpen(false);
        }
    }, []);

    const handleFeatureClick = useCallback((feature: Graphic) => {
        setFeaturesToHighlight([feature]);
        setActiveFeatureId(feature.attributes.OBJECTID);
    }, []);

    const handleMapFeatureSelect = useCallback((features: Graphic[] | null) => {
        setFeaturesToHighlight(features);
        setActiveFeatureId(null);
    }, []);

    const handleSaveFeature = useCallback(async (objectId: number, updatedAttributes: any): Promise<boolean> => {
        try {
            await axios.put(`/api/duplicate-update/${objectId}`, { attributes: updatedAttributes });
            alert("Perubahan berhasil disimpan!");
            return true;
        } catch (error) {
            alert("Gagal menyimpan perubahan.");
            return false;
        }
    }, []);

    return (
        <div className="h-screen w-screen bg-slate-100 flex overflow-hidden">
            <aside className={`absolute md:relative bg-white shadow-lg z-30 h-full w-80 max-w-[85vw] flex-shrink-0 transition-transform duration-300 ease-in-out ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}>
                <DuplicateList
                    duplicates={duplicateData}
                    loading={loading}
                    error={error}
                    onSelect={handleSelectDuplicateGroup}
                    onSave={handleSaveFeature}
                    onFeatureClick={handleFeatureClick}
                    activeFeatureId={activeFeatureId}
                />
            </aside>

            <main className="flex-1 h-full relative">
                <button
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    className={`absolute top-4 left-4 z-20 p-3 bg-white rounded-full shadow-lg text-slate-700 hover:bg-slate-100 transition-all duration-200 ease-in-out ${isSidebarOpen && "md:opacity-0"}`}
                    aria-label="Toggle sidebar"
                >
                    <MenuIcon />
                </button>

                <PetaArcGISSDK
                    featuresToHighlight={featuresToHighlight}
                    onFeatureSelect={handleMapFeatureSelect}
                />
            </main>
        </div>
    );
}