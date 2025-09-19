import { useEffect, useRef } from 'react';
import Map from '@arcgis/core/Map.js';
import MapView from '@arcgis/core/views/MapView.js';
import FeatureLayer from '@arcgis/core/layers/FeatureLayer.js';
import SimpleRenderer from "@arcgis/core/renderers/SimpleRenderer.js";
import SimpleMarkerSymbol from "@arcgis/core/symbols/SimpleMarkerSymbol.js";
import LabelClass from "@arcgis/core/layers/support/LabelClass.js";
import TextSymbol from "@arcgis/core/symbols/TextSymbol.js";
import SimpleLineSymbol from "@arcgis/core/symbols/SimpleLineSymbol.js";

const URL_GARDU_PUBLIK = "https://services.arcgis.com/P3ePLMYs2RVChkJx/arcgis/rest/services/Recent_Earthquakes/FeatureServer/0"; // Data Titik Gempa
const URL_JARINGAN_PUBLIK = "https://services.arcgis.com/P3ePLMYs2RVChkJx/arcgis/rest/services/World_Administrative_Divisions/FeatureServer/0"; // Data Garis Batas Negara

const PetaJaringan = () => {
    const mapDiv = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!mapDiv.current) return;

        const garduRenderer = new SimpleRenderer({
            symbol: new SimpleMarkerSymbol({
                style: "circle",
                color: [255, 100, 100, 0.8],
                size: "8px",
                outline: {
                    color: "white",
                    width: 1
                }
            })
        });

        const garduLabelingInfo = new LabelClass({
            symbol: new TextSymbol({
                color: "white",
                haloColor: "black",
                haloSize: "1px",
                font: {
                    size: 9,
                }
            }),
            labelPlacement: "above-center",
            labelExpressionInfo: {
                expression: "Round($feature.mag, 1)"
            },
            where: "mag > 4"
        });

        const layerGardu = new FeatureLayer({
            url: URL_GARDU_PUBLIK,
            renderer: garduRenderer,
            labelingInfo: [garduLabelingInfo],
        });

        const jaringanRenderer = new SimpleRenderer({
            symbol: new SimpleLineSymbol({
                color: [255, 255, 255, 0.5],
                width: "1px"
            })
        });

        const layerJaringan = new FeatureLayer({
            url: URL_JARINGAN_PUBLIK,
            renderer: jaringanRenderer
        });

        const map = new Map({
            basemap: "arcgis-dark-gray",
            layers: [layerJaringan, layerGardu]
        });

        const view = new MapView({
            container: mapDiv.current,
            map: map,
            center: [118.01, -2.60],
            zoom: 4
        });

        return () => view && view.destroy();
    }, []);

    return <div ref={mapDiv} style={{ height: '100vh', width: '100%' }}></div>;
};

export default PetaJaringan;