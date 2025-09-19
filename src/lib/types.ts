export interface Gardu {
    id: number;
    nama_gardu: string;
    penyulang?: string;
    jalan?: string;
    latitude: number;
    longitude: number;
    jenis?: string;
    kapasitas?: number;
    jenis1?: string;
    cek?: string;
    status?: "OPERATING" | "DOWN" | string;
    ulp_id?: number;
    ratio_id?: string;
}

export interface InfoPanelData {
    [key: string]: string | number | undefined;
}