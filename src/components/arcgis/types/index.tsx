// src/components/arcgis/types.ts

export interface ServiceInfo {
    name: string;
    type: "MapServer" | "FeatureServer" | string;
}

export interface LayerInfo {
    id: number;
    name: string;
    type: string;
    defaultVisibility: boolean;
    minScale: number;
    maxScale: number;
}
export interface LayerField {
    name: string;
    alias: string;
    type: string;
}

export interface LayerInfo {
    id: number;
    name: string;
    type: string;
    fields: LayerField[];
    defaultVisibility: boolean;
    minScale: number;
    maxScale: number;
}

export interface LayerDetails extends LayerInfo {
    description: string;
    fields: { name: string; type: string; alias: string }[];
}

export interface Feature {
    attributes: { [key: string]: any };
    geometry?: any;
}