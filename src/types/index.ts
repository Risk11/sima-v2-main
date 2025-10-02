// src/types.ts

import Graphic from "@arcgis/core/Graphic";

export interface FeatureItem {
    id: number;
    name: string;
    graphic: Graphic;
    layerId: string;
    photoUrls?: string[];
}

export interface LayerConfig {
    id: string;
    title: string;
    url: string;
    nameField: string;
    photoField?: string;
    displayFields: string[];
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

export interface Gardu extends FeatureItem {
    penyulang: string;
    alamat: string;
    latitude: number;
    longitude: number;
    jenis: string;
    kapasitas: number;
    status: string;
    photoUrls?: string[];
}

export interface Pelanggan extends FeatureItem {
    idpel: string;
    nama_pelanggan?: string;
    daya: number;
    alamat: string;
    photoUrls?: string[];
}

export interface Tiang extends FeatureItem {
    kode_tiang: string;
    jenis_tiang: string;
    ukuran_tiang: string;
    photoUrls?: string[];
}

export interface SUTR extends FeatureItem {
    kode_gardu: string;
    jurusan: string;
    panjang: number;
}

export interface SR extends FeatureItem {
    idpel: string;
    panjang: number;
}