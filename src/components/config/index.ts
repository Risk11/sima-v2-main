// src/components/config.ts

import { LayerConfig } from "../../types";

type SupplementaryLayerData = Omit<LayerConfig, 'id' | 'url' | 'title' | 'displayFields'>;

export const supplementaryLayerData: Record<string, SupplementaryLayerData> = {
    "Gardu": {
        nameField: "NAMA_GARDU",
        photoField: "PHOTO",
    },
    "Tiang": {
        nameField: "ID_TIANG",
        photoField: "PHOTO",
    },
    "Pelanggan": {
        nameField: "IDPEL",
        photoField: "PHOTOS",
    },
    "PERALATANDIPELANGGAN": {
        nameField: "IDPEL",
        photoField: "PHOTOS",
    },
    "SR": {
        nameField: "ID_STLTR",
    },
    "SUTR": {
        nameField: "ID_JTR",
    },
};