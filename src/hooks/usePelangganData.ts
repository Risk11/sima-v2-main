import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { ValidasiPelanggan, PelangganFilters, FilterOptions, ApiData } from "../types/data";

export const usePelangganData = () => {
    const [data, setData] = useState<ValidasiPelanggan[]>([]);
    const [loading, setLoading] = useState(false);
    const [loadingOptions, setLoadingOptions] = useState(false);

    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(100);
    const [total, setTotal] = useState(0);

    const [filters, setFilters] = useState<PelangganFilters>({
        tanggal: "",
        no_kwh: "",
        id_pelanggan: "",
        kode_gardu: "",
        nama_surveyor: "",
        nama_project: "",
    });

    const [filterOptions, setFilterOptions] = useState<FilterOptions>({
        kodeGardu: [],
        surveyor: [],
        project: [],
    });

    const fetchFilterOptions = async () => {
        setLoadingOptions(true);
        try {
            const [kodeGarduRes, surveyorRes, projectRes] = await Promise.all([
                fetch("/api/validasi/options/kodegardu"),
                fetch("/api/validasi/options/surveyor"),
                fetch("/api/validasi/options/project"),
            ]);

            const [kodeGarduJson, surveyorJson, projectJson] = await Promise.all([
                kodeGarduRes.json(),
                surveyorRes.json(),
                projectRes.json(),
            ]);

            setFilterOptions({
                kodeGardu: kodeGarduJson.data || [],
                surveyor: surveyorJson.data || [],
                project: projectJson.data || [],
            });
        } catch (err) {
            console.error("Error fetching filter options:", err);
        } finally {
            setLoadingOptions(false);
        }
    };

    const fetchData = async () => {
        const isFiltersEmpty = Object.values(filters).every(value => value === "");

        if (isFiltersEmpty) {
            setData([]);
            setTotal(0);
            return;
        }

        setLoading(true);
        try {
            const queryParams = new URLSearchParams({
                ...filters,
                page: page.toString(),
                perPage: perPage.toString(),
            }).toString();

            const res = await fetch(`/api/validasi/filter?${queryParams}`);

            if (!res.ok) {
                const errorText = await res.text();
                throw new Error(`Server returned an error: ${res.status} - ${errorText}`);
            }

            const json = await res.json();

            if (json.success) {
                const mapped: ValidasiPelanggan[] = json.data.map((f: ApiData) => {
                    let status = "-";
                    let statusDil = "-";

                    if (f.IDPEL && f.NOKWH) {
                        statusDil = "DIL";
                        status = f.VALIDASI === "SUDAH VALID" ? "Validasi" : "Belum Validasi";
                    } else if (f.IDPEL && !f.NOKWH) {
                        statusDil = "DIL_IDPEL";
                    } else if (!f.IDPEL && f.NOKWH) {
                        statusDil = "DIL_NOKWH";
                    } else {
                        statusDil = "Belum Lengkap";
                    }

                    const rawPhotos = (f as any).PHOTOS || (f as any).photos || null;
                    const photosArray = rawPhotos ? (Array.isArray(rawPhotos) ? rawPhotos : [rawPhotos]) : [];

                    return {
                        idpel: f.IDPEL || "",
                        nomor_meter_kwh: f.NOKWH || null,
                        kode_gardu: f.KODE_GARDU || null,
                        nama_surveyor: f.SURVEYOR || null,
                        nama_project: f.NAMA_PROJECT || null,
                        tanggal: f.TANGGAL || null,
                        validasi: f.VALIDASI || null,
                        photos: photosArray,
                        status: status,
                        status_dil: statusDil,
                        MERK_KWH: f.MERK_KWH || null,
                        TAHUN_BUAT: f.TAHUN_BUAT || null,
                        kwh_katap: f.kwh_katap || null,
                        kwh_fasa_jaringan: f.kwh_fasa_jaringan || null,
                        mcb_ampere: f.mcb_ampere || null,
                        mcb_fasa: f.mcb_fasa || null,
                        DAYA: f.DAYA || null,
                        MERK_PEMBATAS: f.MERK_PEMBATAS || null,
                        JENIS_PEMBATAS: f.JENIS_PEMBATAS || null,
                        keterangan: f.keterangan || null,
                    };
                });

                setData(mapped);
                setTotal(json.pagination?.count || 0);
            } else {
                throw new Error(json.message || "Failed to fetch data");
            }
        } catch (err) {
            console.error("Error fetching pelanggan:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (
        e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
    };

    const handleFilterSubmit = (e: FormEvent) => {
        e.preventDefault();
        setPage(1);
        fetchData();
    };

    const handleResetFilter = () => {
        setFilters({
            tanggal: "",
            no_kwh: "",
            id_pelanggan: "",
            kode_gardu: "",
            nama_surveyor: "",
            nama_project: "",
        });
        setPage(1);
        fetchData();
    };

    const updatePelangganInList = (updated: ValidasiPelanggan) => {
        setData((prev) =>
            prev.map((p) => (p.idpel === updated.idpel ? updated : p))
        );
    };

    useEffect(() => {
        fetchFilterOptions();
    }, []);

    useEffect(() => {
        if (Object.values(filters).some(value => value !== "")) {
            fetchData();
        }
    }, [page, perPage, filters]);

    return {
        data,
        loading,
        loadingOptions,
        filters,
        filterOptions,
        page,
        perPage,
        total,
        setPage,
        setPerPage,
        handleFilterChange,
        handleFilterSubmit,
        handleResetFilter,
        updatePelangganInList,
    };
};
