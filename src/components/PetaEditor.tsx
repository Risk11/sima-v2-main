import { useEffect, useRef, useState } from 'react';
import WebMap from '@arcgis/core/WebMap.js';
import MapView from '@arcgis/core/views/MapView.js';
import Editor from "@arcgis/core/widgets/Editor.js";
import esriConfig from "@arcgis/core/config.js";
import IdentityManager from "@arcgis/core/identity/IdentityManager.js";
import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer.js";
import Graphic from "@arcgis/core/Graphic.js";
import Point from "@arcgis/core/geometry/Point.js";
import SimpleMarkerSymbol from "@arcgis/core/symbols/SimpleMarkerSymbol.js";
import { Gardu } from './GarduList';

interface PetaEditorProps {
    garduToZoom: Gardu | null;
}

const PetaEditorDenganGardu = ({ garduToZoom }: PetaEditorProps) => {
    const mapDiv = useRef<HTMLDivElement>(null);
    const [view, setView] = useState<MapView | null>(null);
    const [highlightLayer, setHighlightLayer] = useState<GraphicsLayer | null>(null);

    useEffect(() => {
        if (!mapDiv.current) return;

        IdentityManager.destroyCredentials();
        esriConfig.portalUrl = "";

        const map = new WebMap({
            portalItem: {
                id: "128409938428476295551c6c8888029d"
            }
        });

        const tempHighlightLayer = new GraphicsLayer();
        map.add(tempHighlightLayer);

        const mapView = new MapView({
            container: mapDiv.current,
            map: map,
        });

        const editor = new Editor({ view: mapView });
        mapView.ui.add(editor, "top-right");

        setView(mapView);
        setHighlightLayer(tempHighlightLayer);

        return () => mapView && mapView.destroy();
    }, []);

    useEffect(() => {
        if (view && highlightLayer && garduToZoom) {
            highlightLayer.removeAll();

            const pointGraphic = new Graphic({
                geometry: new Point({
                    longitude: garduToZoom.longitude,
                    latitude: garduToZoom.latitude
                }),
                symbol: new SimpleMarkerSymbol({
                    color: [0, 255, 255, 0.8],
                    size: "12px",
                    outline: { color: [255, 255, 255], width: 2 }
                })
            });

            highlightLayer.add(pointGraphic);

            view.goTo({
                target: pointGraphic,
                zoom: 18
            });
        }
    }, [garduToZoom, view, highlightLayer]);

    return <div ref={mapDiv} style={{ height: '100%', width: '100%' }}></div>;
};

export default PetaEditorDenganGardu;