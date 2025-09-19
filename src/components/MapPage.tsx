"use client";

import { useState, useMemo, useEffect } from "react";
import PetaArcGISSDK from "./PetaArcGISSDK";
import FeatureLayer from "@arcgis/core/layers/FeatureLayer.js";
import Point from "@arcgis/core/geometry/Point.js";
import { Gardu, InfoPanelData } from "@/lib/types";

export default function MapPanel() {
    const [selectedGardu, setSelectedGardu] = useState<Gardu | null>(null);
    const [showInfoPanel, setShowInfoPanel] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [allGardu, setAllGardu] = useState<Gardu[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(false);

    const garduLayerUrl =
        "https://dms.duniacommunica.co.id/gispro3/rest/services/PLN_PERBAIKAN_NUNUKAN/MapServer/0";

    useEffect(() => {
        const fetchGardus = async () => {
            setIsLoading(true);
            setIsError(false);
            try {
                const layer = new FeatureLayer({ url: garduLayerUrl });
                const queryResult = await layer.queryFeatures({
                    where: "1=1",
                    outFields: ["*"],
                    returnGeometry: true,
                });

                const fetchedGardu: Gardu[] = queryResult.features.map((f) => {
                    const attributes = f.attributes;
                    const geometry = f.geometry;

                    let latitude = 0;
                    let longitude = 0;

                    if (geometry && geometry.type === "point") {
                        const pointGeometry = geometry as Point;
                        latitude = pointGeometry.y;
                        longitude = pointGeometry.x;
                    }

                    return {
                        id: attributes.OBJECTID,
                        nama_gardu: attributes.NAMA_GARDU,
                        penyulang: attributes.PENYULANG,
                        jalan: attributes.JALAN,
                        latitude,
                        longitude,
                        jenis: attributes.JENIS,
                        kapasitas: attributes.KAPASITAS,
                        jenis1: attributes.JENIS1,
                        cek: attributes.CEK,
                        status: attributes.STATUS ?? "UNKNOWN",
                        ulp_id: attributes.ULP_ID,
                        ratio_id: attributes.RATIO_ID,
                    };
                });

                setAllGardu(fetchedGardu);
            } catch (error) {
                console.error("Error fetching gardu data from ArcGIS:", error);
                setIsError(true);
            } finally {
                setIsLoading(false);
            }
        };

        fetchGardus();
    }, [garduLayerUrl]);

    const handleSelectGardu = (gardu: Gardu) => {
        setSelectedGardu(gardu);
        setShowInfoPanel(true);
    };

    const handleClosePanel = () => {
        setShowInfoPanel(false);
        setSelectedGardu(null);
    };

    const filteredGardus = useMemo(() => {
        return allGardu.filter((gardu) =>
            gardu.nama_gardu?.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [allGardu, searchTerm]);

    const infoPanelData: InfoPanelData | null = selectedGardu
        ? {
            OBJECTID: selectedGardu.id,
            "Kode Hantaran": "SUTR_GD",
            Penyulang: selectedGardu.penyulang,
            "Nama Project": selectedGardu.status ?? "-",
            "Jenis Kabel": selectedGardu.jenis1,
            "Fasa Jaringan": "1 FASA",
            "Ukuran Kawat": "2x10",
            "Kode Gardu": selectedGardu.jenis,
            "Kode Pelanggan": "NMN_A524",
            "Panjang Hantaran": "28.76",
        }
        : null;

    return (
        <div style={{ position: "relative", width: "100%", height: "100%" }}>
            <div style={{ width: "100%", height: "100%" }}>
                <PetaArcGISSDK garduToZoom={selectedGardu} />
            </div>

            <div
                style={{
                    position: "absolute",
                    top: "1rem",
                    left: "1rem",
                    width: "300px",
                    height: "90%",
                    background: "rgba(255, 255, 255, 0.95)",
                    borderRadius: "8px",
                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
                    padding: "1rem",
                    display: "flex",
                    flexDirection: "column",
                    zIndex: 10,
                }}
            >
                <h2 style={{ fontSize: "1.2rem", marginBottom: "0.5rem" }}>
                    List Of Substation
                </h2>
                <div style={{ color: "#777", marginBottom: "1rem" }}>
                    Total found: {filteredGardus.length}
                </div>

                {/* Input Search */}
                <div style={{ marginBottom: "1rem", position: "relative" }}>
                    <input
                        type="text"
                        placeholder="Search by name..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{
                            width: "100%",
                            padding: "0.5rem 0.5rem 0.5rem 2.5rem",
                            borderRadius: "4px",
                            border: "1px solid #ccc",
                        }}
                    />
                </div>

                <h2 style={{ fontSize: "1.2rem", marginBottom: "0.5rem" }}>
                    List Gardu
                </h2>

                {/* Daftar Gardu */}
                <div style={{ flex: 1, overflowY: "auto" }}>
                    {isLoading ? (
                        <div style={{ textAlign: "center", padding: "2rem" }}>
                            Loading...
                        </div>
                    ) : isError ? (
                        <div
                            style={{
                                textAlign: "center",
                                color: "red",
                                padding: "2rem",
                            }}
                        >
                            Error fetching data.
                        </div>
                    ) : (
                        <ul
                            style={{
                                listStyle: "none",
                                padding: 0,
                                margin: 0,
                            }}
                        >
                            {filteredGardus.length > 0 ? (
                                filteredGardus.map((gardu) => (
                                    <li
                                        key={gardu.id}
                                        onClick={() => handleSelectGardu(gardu)}
                                        style={{
                                            padding: "0.75rem 0.5rem",
                                            borderBottom: "1px solid #eee",
                                            cursor: "pointer",
                                            transition:
                                                "background-color 0.2s",
                                            background:
                                                selectedGardu?.id === gardu.id
                                                    ? "#e0e0e0"
                                                    : "transparent",
                                            display: "flex",
                                            alignItems: "center",
                                        }}
                                    >
                                        <span
                                            style={{
                                                width: "10px",
                                                height: "10px",
                                                borderRadius: "50%",
                                                background:
                                                    gardu.status ===
                                                        "OPERATING"
                                                        ? "green"
                                                        : "red",
                                                marginRight: "0.5rem",
                                            }}
                                        ></span>
                                        {gardu.nama_gardu || "Unnamed"}
                                    </li>
                                ))
                            ) : (
                                <li
                                    style={{
                                        padding: "0.75rem 0.5rem",
                                        color: "#777",
                                    }}
                                >
                                    No gardus found.
                                </li>
                            )}
                        </ul>
                    )}
                </div>
            </div>

            {/* Panel Info Gardu */}
            {showInfoPanel && infoPanelData && (
                <div
                    style={{
                        position: "absolute",
                        bottom: "1rem",
                        left: "50%",
                        transform: "translateX(-50%)",
                        width: "400px",
                        background: "rgba(255, 255, 255, 0.95)",
                        borderRadius: "8px",
                        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
                        padding: "1rem",
                        zIndex: 20,
                        display: "flex",
                        flexDirection: "column",
                        gap: "0.5rem",
                    }}
                >
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            borderBottom: "1px solid #e0e0e0",
                            paddingBottom: "0.5rem",
                        }}
                    >
                        <h3 style={{ margin: 0, fontSize: "1rem" }}>
                            {selectedGardu?.nama_gardu || "Detail Gardu"}
                        </h3>
                        <div>
                            <button
                                onClick={handleClosePanel}
                                style={{
                                    background: "transparent",
                                    border: "none",
                                    fontSize: "1.2rem",
                                    cursor: "pointer",
                                }}
                            >
                                &times;
                            </button>
                        </div>
                    </div>
                    {Object.entries(infoPanelData).map(([key, value]) => (
                        <p key={key} style={{ margin: 0, fontSize: "0.9rem" }}>
                            <b>{key}:</b> {value}
                        </p>
                    ))}
                </div>
            )}
        </div>
    );
}
