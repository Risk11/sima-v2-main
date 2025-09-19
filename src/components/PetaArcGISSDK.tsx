"use client";

import { useEffect, useRef } from "react";
import Map from "@arcgis/core/Map";
import MapView from "@arcgis/core/views/MapView";
import FeatureLayer from "@arcgis/core/layers/FeatureLayer";
import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer";
import Graphic from "@arcgis/core/Graphic";
import Color from "@arcgis/core/Color";

export type Gardu = {
    id: number;
    nama_gardu: string;
    penyulang: string;
    jalan: string;
    latitude: number;
    longitude: number;
    jenis: string;
    kapasitas: number;
    jenis1: string;
    cek: string;
    status: string;
    graphic: Graphic;
    layerId: string;
};

interface PetaProps {
    featureToZoom: Gardu | null;
    onFeatureSelect: (features: Gardu[] | null, layerId: string | null) => void;
}

const layerConfigs = [
    { id: "0", title: "Gardu", url: "https://dms.duniacommunica.co.id/gispro3/rest/services/PLN_PERBAIKAN_NUNUKAN/MapServer/0" },
    { id: "1", title: "Jaringan", url: "https://dms.duniacommunica.co.id/gispro3/rest/services/PLN_PERBAIKAN_NUNUKAN/MapServer/1" },
    { id: "2", title: "Trafo", url: "https://dms.duniacommunica.co.id/gispro3/rest/services/PLN_PERBAIKAN_NUNUKAN/MapServer/2" },
    { id: "3", title: "Kabel", url: "https://dms.duniacommunica.co.id/gispro3/rest/services/PLN_PERBAIKAN_NUNUKAN/MapServer/3" },
    { id: "4", title: "Switch", url: "https://dms.duniacommunica.co.id/gispro3/rest/services/PLN_PERBAIKAN_NUNUKAN/MapServer/4" },
];

const getCentroid = (geometry: any) => {
    if (!geometry) return { x: 0, y: 0 };
    if (geometry.x !== undefined && geometry.y !== undefined) return { x: geometry.x, y: geometry.y };
    if (geometry.extent) return { x: geometry.extent.center.x, y: geometry.extent.center.y };
    return { x: 0, y: 0 };
};

export default function PetaArcGISSDK({ featureToZoom, onFeatureSelect }: PetaProps) {
    const mapDiv = useRef<HTMLDivElement | null>(null);
    const viewRef = useRef<MapView | null>(null);
    const highlightLayerRef = useRef<GraphicsLayer | null>(null);

    useEffect(() => {
        if (!mapDiv.current) return;

        const map = new Map({ basemap: "hybrid" });
        const view = new MapView({
            container: mapDiv.current,
            map,
            center: [117.65, 4.12],
            zoom: 12,
            popup: { dockEnabled: true, dockOptions: { position: "top-right" } },
        });
        viewRef.current = view;

        const highlightLayer = new GraphicsLayer({ id: "highlight-layer" });
        highlightLayerRef.current = highlightLayer;

        const featureLayers = layerConfigs.map(cfg =>
            new FeatureLayer({ url: cfg.url, outFields: ["*"], popupEnabled: false, id: cfg.id })
        );

        view.when(() => {
            map.addMany(featureLayers);
            map.add(highlightLayer);
        });

        const clickHandler = view.on("click", async (event) => {
            try {
                const response = await view.hitTest(event);
                const hitGraphics = response.results
                    .filter((r: any) => r.type === "graphic" && r.graphic?.geometry)
                    .map((r: any) => r.graphic as Graphic);

                if (hitGraphics.length > 0) {
                    highlightLayer.removeAll();
                    const gardusClicked: Gardu[] = hitGraphics.map((g) => {
                        const clone = g.clone();
                        if (g.geometry.type === "point")
                            clone.symbol = { type: "simple-marker", color: new Color([255, 255, 0, 0.8]), size: 12, outline: { color: new Color([255, 255, 0, 1]), width: 2 } } as any;
                        else if (g.geometry.type === "polyline")
                            clone.symbol = { type: "simple-line", color: new Color([255, 255, 0, 1]), width: 3 } as any;
                        else if (g.geometry.type === "polygon")
                            clone.symbol = { type: "simple-fill", color: new Color([255, 255, 0, 0.4]), outline: { color: new Color([255, 255, 0, 1]), width: 2 } } as any;

                        highlightLayer.add(clone);

                        const centroid = getCentroid(g.geometry);
                        return {
                            id: g.attributes.OBJECTID,
                            nama_gardu: g.attributes.NAMA_GARDU || g.attributes.NAME || `Feature ${g.attributes.OBJECTID}`,
                            penyulang: g.attributes.PENYULANG || "-",
                            jalan: g.attributes.JALAN || "-",
                            latitude: centroid.y,
                            longitude: centroid.x,
                            jenis: g.attributes.JENIS || "-",
                            kapasitas: g.attributes.KAPASITAS || 0,
                            jenis1: g.attributes.JENIS1 || "-",
                            cek: g.attributes.CEK || "-",
                            status: g.attributes.status || "OPERATING",
                            graphic: g,
                            layerId: g.layer?.id ?? "unknown",
                        };
                    });

                    const clickedLayerId = hitGraphics[0].layer?.id ?? null;
                    onFeatureSelect(gardusClicked, clickedLayerId);
                } else {
                    highlightLayer.removeAll();
                    onFeatureSelect(null, null);
                }
            } catch (err) {
                console.error("Error on map click", err);
                onFeatureSelect(null, null);
            }
        });

        return () => {
            if (view) {
                clickHandler.remove();
                view.destroy();
            }
        };
    }, [onFeatureSelect]);

    useEffect(() => {
        if (!featureToZoom?.graphic?.geometry || !viewRef.current) return;

        const view = viewRef.current;
        const hl = highlightLayerRef.current;

        view.goTo({ target: featureToZoom.graphic.geometry, zoom: 18 }).catch(() => { });

        if (hl) {
            hl.removeAll();
            const clone = featureToZoom.graphic.clone();
            if (featureToZoom.graphic.geometry.type === "point")
                clone.symbol = { type: "simple-marker", color: new Color([255, 255, 0, 0.8]), size: 12, outline: { color: new Color([255, 255, 0, 1]), width: 2 } } as any;
            else if (featureToZoom.graphic.geometry.type === "polyline")
                clone.symbol = { type: "simple-line", color: new Color([255, 255, 0, 1]), width: 3 } as any;
            else if (featureToZoom.graphic.geometry.type === "polygon")
                clone.symbol = { type: "simple-fill", color: new Color([255, 255, 0, 0.4]), outline: { color: new Color([255, 255, 0, 1]), width: 2 } } as any;

            hl.add(clone);
        }
    }, [featureToZoom]);

    return <div ref={mapDiv} className="w-full h-full" />;
}