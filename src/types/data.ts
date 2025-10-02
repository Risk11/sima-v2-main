export type ValidasiPelanggan = {
    idpel: string;
    nomor_meter_kwh: string | null;
    kode_gardu: string | null;
    nama_surveyor: string | null;
    nama_project: string | null;
    status: string | null;
    status_dil: string | null;
    tanggal: string | null;
    validasi: string | null;
    photos?: string[];

    MERK_KWH: string | null;
    TAHUN_BUAT: string | null;
    kwh_katap: string | null;
    kwh_fasa_jaringan: string | null;
    mcb_ampere: string | null;
    mcb_fasa: string | null;
    DAYA: string | null;
    MERK_PEMBATAS: string | null;
    JENIS_PEMBATAS: string | null;
    keterangan: string | null;
};

export type PelangganFilters = {
    tanggal: string;
    no_kwh: string;
    id_pelanggan: string;
    kode_gardu: string;
    nama_surveyor: string;
    nama_project: string;
};

export type FilterOptions = {
    kodeGardu: string[];
    surveyor: string[];
    project: string[];
};

export type ApiData = {
    IDPEL: string | null;
    NOKWH: string | null;
    KODE_GARDU: string | null;
    SURVEYOR: string | null;
    NAMA_PROJECT: string | null;
    TANGGAL: string | null;
    VALIDASI: string | null;
    PHOTOS?: string;

    MERK_KWH: string | null;
    TAHUN_BUAT: string | null;
    kwh_katap: string | null;
    kwh_fasa_jaringan: string | null;
    mcb_ampere: string | null;
    mcb_fasa: string | null;
    DAYA: string | null;
    MERK_PEMBATAS: string | null;
    JENIS_PEMBATAS: string | null;
    keterangan: string | null;
    STATUS: string | null;
    STATUS_DIL: string | null;
};
