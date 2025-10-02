// src/components/arcgis/ArcgisExplorer.tsx

import { useRef, useEffect } from 'react';
import { useArcGis } from './context/ArcGisProvider';

import Map from "@arcgis/core/Map";
import MapView from "@arcgis/core/views/MapView";
import FeatureLayer from "@arcgis/core/layers/FeatureLayer";

export const ArcgisExplorer = () => {
    const mapDivRef = useRef<HTMLDivElement>(null);
    const mapViewRef = useRef<any>(null);

    const { layers, selectedService, isLoadingLayers } = useArcGis();

    useEffect(() => {
        if (mapDivRef.current && !mapViewRef.current) {
            const map = new Map({
                basemap: "streets-vector"
            });

            mapViewRef.current = new MapView({
                container: mapDivRef.current,
                map: map,
                center: [106.8272, -6.1754],
                zoom: 10,
            });

            console.log("Peta berhasil diinisialisasi.");
        }
    }, []);

    useEffect(() => {
        if (!mapViewRef.current) return;

        const mapView = mapViewRef.current;
        mapView.map.layers.removeAll();

        if (isLoadingLayers) {
            console.log("Memuat layers untuk service:", selectedService);
            return;
        }

        console.log("Data layers yang diterima:", layers);

        if (layers.length > 0) {
            console.log(`Menampilkan ${layers.length} layer dari service: ${selectedService}`);

            const featureLayers = layers.map(layerInfo => {
                return new FeatureLayer({
                    url: `https://dms.duniacommunica.co.id/mapserver/rest/services/${selectedService}/MapServer/${layerInfo.id}`,
                    title: layerInfo.name,
                    visible: layerInfo.defaultVisibility,
                    minScale: layerInfo.minScale,
                    maxScale: layerInfo.maxScale,
                });
            });

            mapView.map.addMany(featureLayers.reverse());

            console.log("Layer berhasil ditambahkan ke peta:", featureLayers.map(l => l.title));
        }
    }, [layers, isLoadingLayers, selectedService]);

    return (
        <div style={{ height: '100%', width: '100%', position: 'relative' }}>
            {isLoadingLayers && (
                <div style={{ position: 'absolute', top: 10, left: '50%', transform: 'translateX(-50%)', background: 'rgba(0,0,0,0.7)', color: 'white', padding: '8px 16px', borderRadius: '8px', zIndex: 10 }}>
                    Memuat Layers...
                </div>
            )}
            <div ref={mapDivRef} style={{ height: '100%', width: '100%' }}></div>
        </div>
    );
};