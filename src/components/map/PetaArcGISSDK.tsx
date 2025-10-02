"use client";

import { useEffect, useRef, useMemo } from "react";
import Map from "@arcgis/core/Map";
import MapView from "@arcgis/core/views/MapView";
import FeatureLayer from "@arcgis/core/layers/FeatureLayer";
import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer";
import Graphic from "@arcgis/core/Graphic";
import Color from "@arcgis/core/Color";
import LayerList from "@arcgis/core/widgets/LayerList";
import Fullscreen from "@arcgis/core/widgets/Fullscreen";
import Expand from "@arcgis/core/widgets/Expand";
import Legend from "@arcgis/core/widgets/Legend";

import { useActiveLayerConfigs } from "@/components/arcgis/hooks/useActiveLayerConfigs";

interface PetaProps {
    featureToZoom: { graphic: Graphic; layerId: string } | null;
    onFeatureSelect: (feature: Graphic | null, layerId: string | null) => void;
}

export default function PetaArcGISSDK({
    featureToZoom,
    onFeatureSelect,
}: PetaProps) {
    const mapDiv = useRef<HTMLDivElement | null>(null);
    const viewRef = useRef<MapView | null>(null);
    const highlightLayerRef = useRef<GraphicsLayer | null>(null);
    const featureLayersRef = useRef<FeatureLayer[]>([]);

    const activeLayerConfigs = useActiveLayerConfigs();

    const highlightSymbols = useMemo(() => ({
        point: { type: "simple-marker", color: new Color([255, 255, 0, 0.8]), size: 14, outline: { color: new Color([255, 255, 0, 1]), width: 2 } } as any,
        polyline: { type: "simple-line", color: new Color([255, 255, 0, 1]), width: 4 } as any,
        polygon: { type: "simple-fill", color: new Color([255, 255, 0, 0.8]), outline: { color: new Color([255, 255, 0, 1]), width: 3 } } as any,
    }), []);

    useEffect(() => {
        if (!mapDiv.current) return;

        let view: MapView;
        const map = new Map({ basemap: "hybrid" });
        view = new MapView({
            container: mapDiv.current,
            map,
            center: [117.65, 4.12],
            zoom: 12,
            popup: { dockEnabled: true, dockOptions: { position: "top-right" } },
        });
        viewRef.current = view;

        const highlightLayer = new GraphicsLayer({ id: "highlight-layer" });
        highlightLayerRef.current = highlightLayer;
        map.add(highlightLayer);

        view.when(() => {
            const fullscreen = new Fullscreen({ view });
            const layerList = new LayerList({
                view,
                listItemCreatedFunction: (event) => {
                    const item = event.item;
                    if (item.layer?.type === "feature") {
                        item.panel = {
                            content: new Legend({ view, layerInfos: [{ layer: item.layer }] }),
                            open: false
                        };
                    }
                }
            });
            const layerListExpand = new Expand({ view, content: layerList, expandIcon: "layers", group: "top-left" });
            view.ui.add(fullscreen, "top-left");
            view.ui.add(layerListExpand, "top-left");
        });

        const clickHandler = view.on("click", async (event) => {
            try {
                const response = await view.hitTest(event, { include: featureLayersRef.current });
                const hitResult = response.results[0];
                highlightLayer.removeAll();
                onFeatureSelect(null, null);

                if (!hitResult || !("graphic" in hitResult)) return;

                const { graphic: hitGraphic } = hitResult;
                const hitLayer = hitGraphic.layer as FeatureLayer;
                if (!hitLayer?.id || !hitGraphic.geometry) return;

                const clone = hitGraphic.clone();
                const symbol = highlightSymbols[hitGraphic.geometry.type as keyof typeof highlightSymbols];
                if (symbol) {
                    clone.symbol = symbol;
                    highlightLayer.add(clone);
                }
                onFeatureSelect(hitGraphic, hitLayer.id);
            } catch (err) {
                console.error("Error saat klik peta", err);
                onFeatureSelect(null, null);
            }
        });

        return () => {
            if (view) {
                clickHandler.remove();
                view.destroy();
                viewRef.current = null;
            }
        };
    }, [highlightSymbols, onFeatureSelect]);

    useEffect(() => {
        const view = viewRef.current;
        if (!view || !view.map) return;

        view.map.removeMany(featureLayersRef.current);

        const newFeatureLayers = activeLayerConfigs.map((cfg) => new FeatureLayer({
            url: cfg.url,
            outFields: ["*"],
            id: cfg.id,
            title: cfg.title,
            popupEnabled: false,
        }));

        featureLayersRef.current = newFeatureLayers;
        view.map.addMany(newFeatureLayers);

    }, [activeLayerConfigs]);

    useEffect(() => {
        const view = viewRef.current;
        const highlightLayer = highlightLayerRef.current;
        if (!view || !highlightLayer) return;

        highlightLayer.removeAll();
        if (featureToZoom?.graphic?.geometry) {
            view.goTo({ target: featureToZoom.graphic.geometry, zoom: 19 }).catch(() => { });

            const clone = featureToZoom.graphic.clone();
            const symbol = highlightSymbols[featureToZoom.graphic.geometry.type as keyof typeof highlightSymbols];
            if (symbol) {
                clone.symbol = symbol;
                highlightLayer.add(clone);
            }
        }
    }, [featureToZoom, highlightSymbols]);

    return <div ref={mapDiv} className="w-full h-full" />;
}