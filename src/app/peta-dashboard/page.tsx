"use client";

import { useState, useCallback } from "react";
import LayerList from "../../components/LayerList";
import PetaArcGISSDK, { Gardu } from "../../components/PetaArcGISSDK";
import Graphic from "@arcgis/core/Graphic";

export default function PetaDashboardPage() {
    const [selectedFeature, setSelectedFeature] = useState<Graphic | null>(null);
    const [selectedLayerFromMap, setSelectedLayerFromMap] = useState<string | null>(null);

    const handleFeatureSelectFromList = useCallback((feature: Graphic | null) => {
        setSelectedFeature(feature);
    }, []);

    const handleFeatureSelectFromMap = useCallback((features: Gardu[] | null, layerId: string | null) => {
        if (features && features.length > 0) {
            setSelectedFeature(features[0].graphic);
            setSelectedLayerFromMap(layerId);
        } else {
            setSelectedFeature(null);
            setSelectedLayerFromMap(null);
        }
    }, []);

    return (
        <div className="flex w-full h-screen bg-gray-100 font-sans">
            <div className="w-1/3 lg:w-1/4 h-full bg-slate-900 text-slate-300 shadow-2xl overflow-hidden">
                <LayerList
                    onFeatureSelect={handleFeatureSelectFromList}
                    selectedFeature={selectedFeature}
                    initialSelectedLayer={selectedLayerFromMap}
                />
            </div>

            <div className="w-2/3 lg:w-3/4 h-full relative">
                <PetaArcGISSDK
                    featureToZoom={selectedFeature ? { id: selectedFeature.attributes.OBJECTID, nama_gardu: selectedFeature.attributes.NAMA_GARDU || "Feature", penyulang: "-", jalan: "-", latitude: 0, longitude: 0, jenis: "-", kapasitas: 0, jenis1: "-", cek: "-", status: "OPERATING", graphic: selectedFeature, layerId: selectedLayerFromMap || "0" } : null}
                    onFeatureSelect={handleFeatureSelectFromMap}
                />
            </div>
        </div>
    );
}