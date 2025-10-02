import Point from "@arcgis/core/geometry/Point";
import Geometry from "@arcgis/core/geometry/Geometry";
import Polygon from "@arcgis/core/geometry/Polygon";
import Polyline from "@arcgis/core/geometry/Polyline";
import FeatureLayer from "@arcgis/core/layers/FeatureLayer";

import { layerConfigs } from "../components/config";
import { LayerConfig } from "../types";

export function getConfigForLayer(layer: FeatureLayer): LayerConfig | null {
    if (!layer) return null;

    let config = layerConfigs.find(cfg => cfg.id === layer.id);
    if (config) {
        return config;
    }
    const cleanLayerUrl = layer.url ? layer.url.split("?")[0] : "";
    config = layerConfigs.find(cfg => {
        const cleanConfigUrl = cfg.url.split('?')[0];
        return cleanConfigUrl === cleanLayerUrl;
    });

    return config || null;
}

export const getCentroid = (geometry: Geometry): Point => {
    switch (geometry.type) {
        case "point":
            return geometry as Point;
        case "polyline": {
            const extent = (geometry as Polyline).extent;
            return extent ? extent.center : new Point({ x: 0, y: 0 });
        }
        case "polygon": {
            const extent = (geometry as Polygon).extent;
            return extent ? extent.center : new Point({ x: 0, y: 0 });
        }
        default:
            return new Point({ x: 0, y: 0 });
    }
};