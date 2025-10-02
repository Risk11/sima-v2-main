"use client";
import { useState, useCallback, useMemo, useEffect } from "react";
import PetaArcGISSDK from "../components/map/PetaArcGISSDK";
import LayerList from "../components/list/LayerList";
import Graphic from "@arcgis/core/Graphic";

const CloseIcon = () => (
    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
);

const MenuIcon = () => (
    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
    </svg>
);

export default function PetaDashboardPage() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [selectedFeature, setSelectedFeature] = useState<Graphic | null>(null);
    const [selectedLayerId, setSelectedLayerId] = useState<string | null>(null);

    useEffect(() => {
        if (window.innerWidth < 768) {
            setIsSidebarOpen(false);
        }
    }, []);

    const featureToZoom = useMemo(() => {
        if (!selectedFeature || !selectedLayerId) return null;
        return { graphic: selectedFeature, layerId: selectedLayerId };
    }, [selectedFeature, selectedLayerId]);

    const handleMapFeatureSelect = useCallback((feature: Graphic | null, layerId: string | null) => {
        setSelectedFeature(feature);
        setSelectedLayerId(layerId);
        if (feature && window.innerWidth < 768) {
            setIsSidebarOpen(true);
        }
    }, []);

    const handleListFeatureSelect = useCallback((feature: Graphic | null, layerId: string | null) => {
        setSelectedFeature(feature);
        setSelectedLayerId(layerId);
        if (window.innerWidth < 768) {
            setIsSidebarOpen(false);
        }
    }, []);

    return (
        <div className="h-screen w-screen bg-slate-100 flex overflow-hidden">
            <aside
                className={`
                    absolute md:relative bg-white shadow-lg z-30 h-full w-80 max-w-[85vw] flex-shrink-0
                    transition-transform duration-300 ease-in-out
                    ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
                    md:translate-x-0
                `}
            >
                <div className="flex h-full flex-col">
                    <header className="p-0 border-b border-slate-200 flex justify-between items-center">
                        {/* <h1 className="text-xl font-bold text-slate-800">Daftar Layer</h1> */}
                        <button
                            onClick={() => setIsSidebarOpen(false)}
                            className="md:hidden text-slate-500 hover:text-slate-800"
                            aria-label="Tutup sidebar"
                        >
                            <CloseIcon />
                        </button>
                    </header>
                    <div className="flex-1 overflow-y-auto">
                        <LayerList
                            onFeatureSelect={handleListFeatureSelect}
                            selectedFeature={selectedFeature}
                        />
                    </div>
                </div>
            </aside>

            <main className="flex-1 h-full relative">
                <button
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    className={`
                        absolute top-4 left-4 z-20 p-3 bg-white rounded-full shadow-lg
                        text-slate-700 hover:bg-slate-100 hover:scale-105
                        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                        transition-all duration-200 ease-in-out
                        ${isSidebarOpen && "rotate-90 opacity-0"}
                    `}
                    aria-label="Toggle sidebar"
                >
                    <MenuIcon />
                </button>

                <PetaArcGISSDK
                    featureToZoom={featureToZoom}
                    onFeatureSelect={handleMapFeatureSelect}
                />
            </main>

            {isSidebarOpen && (
                <div
                    onClick={() => setIsSidebarOpen(false)}
                    className="md:hidden fixed inset-0 bg-black/60 z-20 transition-opacity duration-300"
                ></div>
            )}
        </div>
    );
}